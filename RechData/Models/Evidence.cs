using System;

namespace RechData.Models
{
    public class Evidence
    {
        public Guid EvidenceId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public Guid? HypothesisId { get; set; }
        public Guid? FactionId { get; set; }
        public Guid? ReferenceId { get; set; }
        public decimal Importance { get; set; }
    }
}
