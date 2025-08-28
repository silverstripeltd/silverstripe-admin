<p id="$ID"
   tabindex="0"
   class="form-control-static<% if $extraClass %> $extraClass<% end_if %>"
   role="textbox"
   aria-readonly="true"
   <% include SilverStripe/Forms/AriaAttributes %>
>$FormattedValue</p>
<% if $IncludeHiddenField %>
    <input $getAttributesHTML("id", "type") id="hidden-{$ID}" type="hidden" />
<% end_if %>
