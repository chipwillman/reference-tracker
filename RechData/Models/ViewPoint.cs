using System;

namespace RechData.Models
{
    public class ViewPoint
    {
        public Guid ViewPointId { get; set; }
        public string Name { get; set; }
        public string BeginDate { get; set; }
        public string EndDate { get; set; }
        public string Description { get; set; }
        public Evidence[] Evidence { get; set; }
        public Reference[] References { get; set; }
    }
}
