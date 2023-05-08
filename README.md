# contentful
contenful management api projects

Hi, 

This project aims at consolidating my knowledge of contentful management api.

Original task given by Melanie Bouic:
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

Create a content model on contentful platform: Name "product"
with the following fields: 
Title - short text required
Path - short text
Label -short tet
Introduction- long text
shop - reference accepting only specific values -"Shop"  with appearance: "entry Link"


Creation of script
1. communication with contentful management API

2. populate the contentType with 1 content
title ="sensitve pampers" 
path="pampers.com/sensitive"
label="wipes"
introduction="Pampers Swaddlers diapers are the number one choice of hospitals, based on, protection, comfort, dryness and more. Buy now at Pampers.com" 


3. A function to create a field name "slug" - short text with the value found in the title field 
Published the content. 
create a log file (log.txt) in the following format 


4.DATE: Wed May 03 2023 10:47:22 GMT+0400 (Mauritius Standard Time)

Published "filed Name"- id: "ID"

5.Create another another field called "US shop" in boolean type with default value true

6.append your log file with successful or unsuccessful response (in the same format above)

7.Delete the field "Shop" 
append your log file with successful or unsuccessful response (in the same format above)

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

Note: 

1.  log.txt file: I am not sure if this is the way to it should be updated with logs, so far I've been hardcoding.
2.  function createEntry: Can create an entry, however, cannot publish, mode: draft.
3.  function createField: works, though I have not tested part 5.
4.  Remainng tasks: 6 && 7

Have a nice day ahead :)
