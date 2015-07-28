using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace choseTheme.Controllers
{
    public class DefaultController : Controller
    {
        public ActionResult offer()
        {
            var webClient = new System.Net.WebClient { Encoding = Encoding.UTF8 };
            var jsonText = webClient.DownloadString("http://www.codejapan.jp/2015/api/1.0/offer/");
            return Content(jsonText, "application/json");
        }
    }
}