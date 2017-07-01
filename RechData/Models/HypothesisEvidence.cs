using System;

namespace RechData.Models
{
    public class HypothesisEvidence
    {
        public Guid HypothesisId { get; set; }
        public Guid HypothesisEvidenceId { get; set; }
        public Guid ViewpointEvidenceId { get; set; }
        public string ViewpointName { get; set; }
        public string EvidenceCitation { get; set; }
        public string EvidenceStatement { get; set; }
        public string HypothesisStatement { get; set; }
        public decimal Importance { get; set; }

        public string EvidenceStatus { get; set; }
    }
}
