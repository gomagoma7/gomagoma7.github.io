#!/bin/bash
set -e

# Create output directory
mkdir -p assets/slides

# Process each Marp markdown file
for file in _slides/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file" .md)
    echo "Processing $filename..."

    # Create output directories
    mkdir -p "assets/slides/${filename}"
    mkdir -p "assets/slides/${filename}/thumbnails"

    # Generate HTML version
    marp "$file" -o "assets/slides/${filename}.html" --html --allow-local-files

    # Generate slide images
    marp "$file" --images png -o "assets/slides/${filename}/" --image-scale 2

    # Rename images to slide-XX.png
    cd "assets/slides/${filename}"
    counter=1
    for img in *.png; do
      if [ -f "$img" ] && [ "$img" != "slide-*.png" ]; then
        newname=$(printf "slide-%02d.png" $counter)
        mv "$img" "$newname"
        echo "Created: $newname"
        counter=$((counter + 1))
      fi
    done

    # Generate thumbnails
    for img in slide-*.png; do
      if [ -f "$img" ]; then
        convert "$img" -resize 300x169 "thumbnails/$img"
        echo "Created thumbnail: $img"
      fi
    done

    cd ../../..

    # Generate metadata.json
    slide_count=$(ls "assets/slides/${filename}"/slide-*.png 2>/dev/null | wc -l)

    cat > "assets/slides/${filename}/metadata.json" <<EOF
{
  "title": "${filename}",
  "author": "Junya Honda",
  "date": "$(date -I)",
  "totalSlides": ${slide_count},
  "slides": [
EOF

    for i in $(seq 1 $slide_count); do
      slide_num=$(printf "%02d" $i)
      echo "    {" >> "assets/slides/${filename}/metadata.json"
      echo "      \"number\": $i," >> "assets/slides/${filename}/metadata.json"
      echo "      \"image\": \"slide-${slide_num}.png\"," >> "assets/slides/${filename}/metadata.json"
      echo "      \"thumbnail\": \"thumbnails/slide-${slide_num}.png\"," >> "assets/slides/${filename}/metadata.json"
      echo "      \"title\": \"Slide $i\"" >> "assets/slides/${filename}/metadata.json"
      if [ $i -eq $slide_count ]; then
        echo "    }" >> "assets/slides/${filename}/metadata.json"
      else
        echo "    }," >> "assets/slides/${filename}/metadata.json"
      fi
    done

    echo "  ]" >> "assets/slides/${filename}/metadata.json"
    echo "}" >> "assets/slides/${filename}/metadata.json"

    echo "Generated $slide_count slides for $filename"
  fi
done
