---
title: test
date: 2026.08.28
description: testey westy.
tags:
  - c++
---

# Introduction

lory ipsem

```cpp
#include <immintrin.h>

void process_audio(float* in, float* out, size_t n) {
    for (size_t i = 0; i < n; i += 8) {
        __m256 v = _mm256_loadu_ps(&in[i]);
        _mm256_storeu_ps(&out[i], v);
    }
}
```
