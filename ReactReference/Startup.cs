using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ReactReference.Startup))]
namespace ReactReference
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
