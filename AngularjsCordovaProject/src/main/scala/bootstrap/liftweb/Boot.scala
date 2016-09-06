package bootstrap.liftweb

import net.liftweb._

import common._
import http._
import net.liftweb.sitemap._


class Boot extends Logger {


  // where to search snippet
  LiftRules.addToPackages("code")


  // Build SiteMap
  def sitemap = SiteMap(
    //Search actions
    Menu.i("Home") / "index"
)

  LiftRules.setSiteMap(sitemap)

  LiftRules.early.append(_.setCharacterEncoding("UTF-8"))

  // Use HTML5 for rendering
  LiftRules.htmlProperties.default.set((r: Req) =>
    new Html5Properties(r.userAgent))

}
