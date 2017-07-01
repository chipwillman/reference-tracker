﻿using System;

namespace RechData.Models
{
    public class Hypothesis
    {
        public Guid HypothesisId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid FactionId { get; set; }
        public HypothesisEvidence[] Evidence { get; set; }
        public Reference[] References { get; set; }
    }
}
