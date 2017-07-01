using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using RechData;
using RechData.Models;

namespace ReactReference.Controllers
{
    public class EvidenceController : Controller
    {
        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Evidences()
        {
            return Json(new SqlRepository().GetEvidence(0, 100), JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Evidence(string viewpointId)
        {
            Guid pk = Guid.Parse(viewpointId);
            return Json(new SqlRepository().GetEvidence(pk), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddEvidence(Evidence evidence)
        {
            evidence.EvidenceId = Guid.NewGuid();
            new SqlRepository().AddEvidence(evidence);
            return Content("Evidence added");
        }

        [HttpPost]
        public ActionResult DeleteEvidence(Evidence evidence)
        {
            new SqlRepository().DeleteEvidence(evidence);
            return Content("Evidence Deleted");
        }
    }
}