var JGL_TEMPLATE = {};

(function() {

/*
    <script id="template-demo" type="text/template">
        <div><a href="{{url}}">{{name}}</a>, {{city}}, {{state}}</div>
    </script>
*/
    // ***********************************
    this.renderHtmlTemplate = function (template, data, target, replace) {
        var html = $(template).html();
        html = this.buildTemplate(html, data);
        insertIntoDom(html, target, replace);
    };
    // ***********************************
    this.renderTemplateFromString = function (html, data, target, replace) {
        html = this.buildTemplate(html, data);
        insertIntoDom(html, target, replace);
    };
    // ***********************************
    var insertIntoDom = function (html, target, replace) {
        if (replace) {
            $(target).html(html);
        } else {
            $(target).append(html);
        }
    };
    // ***********************************
    this.buildTemplate = function (html, data) {
        // Loop through data object and replace any tags that have the same names as the object fields
        for (var key in data) {
            html = html.replace(new RegExp('{{'+key+'}}','g'), data[key]);
        }
        return html;
    };

    /*
    // HTML Template
    <script id="template-demo" type="text/template">
        <div><a href="{{url}}">{{name}}</a>, {{city}}, {{state}}</div>
    </script>

    // String Template
     var htmlText = '<a href="{{url}}">{{name}}</a>';

    // Data to insert into the template
    var data = {"name":"Chester Copperpot","city":"Colfax","state":"CA","url":"http://google.com/"};

    // Insert into an HTML template
    renderHtmlTemplate('#template-demo', data, '#output');

     // Insert into an String template
    renderTemplateFromString(htmlText, data, '#output');

     // Simple text replacement - no DOM manipulation
    console.log(buildTemplate(htmlText, data));
    */
}).apply(JGL_TEMPLATE);
