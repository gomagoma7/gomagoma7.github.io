---
title: iEEG Data Analysis with Python
version: 1.0.0
theme: dracula
footer: Slides by [Junya Honda](https://gomagoma7.github.io)
header: iEEG DATA ANALYSIS
author: Junya Honda
paginate: true
marp: true
size: 16:9
keywords: iEEG, Python, Neuroscience, Data Analysis
---

# iEEG Data Analysis with Python

### A Practical Guide to Brain Signal Processing

Junya Honda
Neural Information Dynamics Lab

<style scoped>
  section{align-content: center;}
</style>

---

# Table of Contents

1. Introduction to iEEG
2. Data Preprocessing
3. Time-Frequency Analysis
4. Graph Neural Networks for Brain Connectivity
5. Future Directions

---

<!-- header: Introduction to iEEG -->

# What is iEEG?

**Intracranial EEG (iEEG)** - Brain signals recorded directly from electrodes placed on or in the brain

## Advantages
- **High spatial resolution** - Precise localization
- **High signal-to-noise ratio** - Clean signals
- **Direct cortical access** - No skull interference

## Applications
- Epilepsy research
- Cognitive neuroscience
- Brain-computer interfaces

---

<!-- header: Data Preprocessing -->

# Step 1: Data Preprocessing

## Key Steps

1. **Loading data** - Read from various formats (EDF, BIDS, etc.)
2. **Filtering** - Remove noise and artifacts
3. **Resampling** - Standardize sampling rates
4. **Artifact rejection** - Remove bad channels/epochs

```python
import mne
import numpy as np

# Load iEEG data
raw = mne.io.read_raw_edf('data.edf', preload=True)

# Apply bandpass filter (1-100 Hz)
raw.filter(1, 100, fir_design='firwin')
```

---

<!-- header: Time-Frequency Analysis -->

# Step 2: Time-Frequency Analysis

## Wavelet Transform

Analyze how frequency content changes over time

```python
from scipy import signal

# Perform continuous wavelet transform
frequencies = np.logspace(1, 2, 50)  # 10-100 Hz
widths = frequencies / 2
cwtmatr = signal.cwt(data, signal.morlet2, widths)
```

## Applications
- Event-related spectral perturbation (ERSP)
- Phase-amplitude coupling
- Neural oscillation analysis

---

<!-- header: Graph Neural Networks -->

# Step 3: GNN for Brain Connectivity

## Why GNN?

Brain networks are **graph structures**:
- Nodes = Brain regions
- Edges = Functional connectivity

## Implementation

```python
import torch
import torch_geometric as pyg

class BrainGNN(torch.nn.Module):
    def __init__(self, num_features, hidden_dim):
        super().__init__()
        self.conv1 = pyg.nn.GCNConv(num_features, hidden_dim)
        self.conv2 = pyg.nn.GCNConv(hidden_dim, hidden_dim)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index).relu()
        x = self.conv2(x, edge_index)
        return x
```

---

<!-- header: Future Directions -->

# Future Research Directions

## 1. Explainable AI (XAI)
- Understanding what GNNs learn from brain data
- Identifying important features and connections
- Clinical interpretability

## 2. Real-time Analysis
- Online seizure prediction
- Adaptive brain-computer interfaces
- Closed-loop neuromodulation

## 3. Large-scale Studies
- Multi-site collaboration
- Standardized pipelines
- Open-source tools

---

# Summary

✅ iEEG provides high-quality brain signals
✅ Python ecosystem offers powerful analysis tools
✅ GNNs are promising for connectivity analysis
✅ Many exciting research opportunities ahead!

## Resources
- Code: github.com/gomagoma7
- Contact: honda.junya.qt@tut.jp

<style scoped>
  section{align-content: center;}
</style>

---

# Thank you!

Questions?

<style scoped>
  section{align-content: center; font-size: 3rem;}
</style>
