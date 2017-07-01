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
    public class HypothesisController : Controller
    {
        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Hypotheses()
        {
            return Json(new SqlRepository().GetHypotheses(0, 100), JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Hypothesis(string hypothesisId)
        {
            Guid pk = Guid.Parse(hypothesisId);
            return Json(new SqlRepository().GetHypothesis(pk), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddHypothesis(Hypothesis hypothesis)
        {
            hypothesis.HypothesisId = Guid.NewGuid();
            new SqlRepository().AddHypothesis(hypothesis);
            return Content("Hypothesis added");
        }

        [HttpPost]
        public ActionResult DeleteHypothesis(Hypothesis hypothesis)
        {
            new SqlRepository().DeleteHypothesis(hypothesis);
            return Content("Hypothesis Deleted");
        }
    }
}