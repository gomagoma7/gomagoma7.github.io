---
layout: page
title: Graph Neural Networks for Brain Networks
description: Applying GNNs to model functional connectivity in the brain
img: assets/img/projects/gnn-thumbnail.jpg
importance: 2
category: work
related_publications: false
---

## Overview

This project explores the application of Graph Neural Networks (GNNs) to analyze brain connectivity patterns from iEEG data.

## Motivation

The brain is naturally a graph structure:
- **Nodes**: Brain regions (electrode sites)
- **Edges**: Functional connections between regions

GNNs are perfectly suited for learning from this structured data.

## Approach

### 1. Graph Construction
- Extract functional connectivity from iEEG signals
- Build dynamic graphs that change over time
- Consider multiple frequency bands

### 2. GNN Architecture
- Graph Convolutional Networks (GCN)
- Graph Attention Networks (GAT)
- Temporal Graph Networks

### 3. Applications
- Seizure prediction
- Brain state classification
- Connectivity pattern discovery

## Tech Stack

- PyTorch & PyTorch Geometric
- NetworkX for graph manipulation
- scikit-learn for traditional ML baselines

## Results

🔬 Preliminary results show promising performance in seizure prediction tasks

---

**Keywords**: GNN, Brain Networks, Deep Learning, Neuroscience
