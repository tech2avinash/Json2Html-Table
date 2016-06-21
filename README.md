Include this script file in Website.<br/>
&nbsp;&nbsp;&nbsp;<b>jsontotable(ajaxurl, divid, cssclass,paging,search);</b><br/>
<b>ajaxurl</b>:'service url which returns a json string'<br/>
<b>divid</b>:'id of div where the html table to be rendered'<br/>
<b>cssclass</b>:'css class of a table'<br/>
<b>paging</b>:'bool property if true paging will be added else no paging'<br/>
<b>search</b>:'bool property if true search functionality will be added else no search function'<br/>

e.g:<br/>
```html
<script type="text/javascript">
        jsontotable('http://....../Webstats.json', 'div_table_stats', 'table table-responsive', true, false);
</script>

<div id="div_table_stats"><br/>
</div><br/>
```

