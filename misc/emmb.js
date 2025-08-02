var host=window.location.host,sourceMap={"imgur.com":"emmbcont.js","imgur-stg.com":"s.imgur-stg.com/min/embed-controller.js"},source=sourceMap[host]||"imgur.com/min/embed-controller.js";


if(!window.imgurEmbed)
    {
        window.imgurEmbed={tasks:0};
        var script=document.createElement("script");
        script.type="text/javascript",script.async=!0,script.src="//"+source,script.charset="utf-8",document.getElementsByTagName("head")[0].appendChild(script)
        }
        window.imgurEmbed.createIframe?imgurEmbed.createIframe():imgurEmbed.tasks++;




        //# sourceMappingURL=embed.js.map