<%-- Using conditional statements to ensure there are not blank space prefixed or suffixed to the attribute values --%>
<% if $Message && $Description %>
    aria-describedby="message-$ID describes-$ID"
<% else_if $Message %>
    aria-describedby="message-$ID"
<% else_if $Description %>
    aria-describedby="describes-$ID"
<% end_if %>
<% if $Title && $RightTitle %>
    aria-labelledby="title-$ID extra-label-$ID"
<% else_if $Title %>
    aria-labelledby="title-$ID"
<% else_if $RightTitle %>
    aria-labelledby="extra-label-$ID"
<% end_if %>
