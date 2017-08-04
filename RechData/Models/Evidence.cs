using System;

namespace RechData.Models
{
    public class Evidence
    {
        public Guid EvidenceId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public Guid? ViewpointId { get; set; }
        public Guid? HypothesisId { get; set; }
        public Guid? FactionId { get; set; }
        public Guid? ReferenceId { get; set; }
        public decimal Importance { get; set; }
        public string Statement { get; set; }
        public string UrlLinks { get; set; }
        public string ReferenceName { get; set; }
        public string Cite { get; set; }
        public string Type { get; set; }
        public decimal Confidence { get; set; }
        public Guid ParentReferenceId { get; set; }
    }
}
