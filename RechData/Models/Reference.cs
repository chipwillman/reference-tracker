using System;

namespace RechData.Models
{
    public class Reference
    {
        public Guid ReferenceId { get; set; }
        public string Name { get; set; }
        public string Cite { get; set; }
        public string Type { get; set; }
        public decimal Confidence { get; set; }
        public Guid ParentReferenceId { get; set; }
    }
}
