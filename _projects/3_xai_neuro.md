---
layout: page
title: Explainable AI for Neuroscience
description: Making neural network predictions interpretable for clinical use
img: assets/img/projects/xai-thumbnail.jpg
importance: 3
category: work
related_publications: false
---

## Overview

Developing explainable AI methods to understand what neural networks learn from brain data, with a focus on clinical interpretability.

## Challenge

While deep learning models can achieve high accuracy on neuroscience tasks, their predictions are often not interpretable. This is a critical issue for clinical applications where doctors need to understand *why* a model makes a specific prediction.

## Approach

### 1. Attention Mechanisms
- Visualize which brain regions the model focuses on
- Identify temporal patterns in neural activity

### 2. Counterfactual Explanations
- "What if" scenarios: How would the prediction change if this brain region behaved differently?
- Generate minimal interventions needed to change predictions

### 3. Feature Importance
- SHAP values for neural network predictions
- Layer-wise relevance propagation (LRP)

## Applications

- **Seizure Prediction**: Explain which brain regions are most predictive
- **Cognitive State Decoding**: Understand neural markers of different mental states
- **Clinical Decision Support**: Provide interpretable insights to clinicians

## Tech Stack

- SHAP for model-agnostic explanations
- Captum (PyTorch) for neural network interpretability
- Custom visualization tools

## Impact

Making AI models interpretable is crucial for clinical adoption and building trust with medical professionals.

---

**Keywords**: XAI, Explainable AI, Neuroscience, Clinical ML, Interpretability
