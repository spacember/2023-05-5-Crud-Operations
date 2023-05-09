# Contentful Management Api Training

A sample 'ticket' given by Melanie Bouic for me to practice with CMA:

-----

##The ticket

### Contentful Platform

- Create a content model on contentful platform: Name "product" with the following fields: 

| Field name   | Field value                                                                     | Required |
| ------------ | ------------------------------------------------------------------------------- | -------- |
| Title        | short text                                                                      | true     |
| Path         | short text                                                                      |
| Label        | short tet                                                                       |
| Introduction | long text                                                                       |
| shop         | reference accepting only specific values -"Shop"  with appearance: "entry Link" |

### Scripting

Creation of script

1. Communication with contentful management API
2. Populate the contentType with 1 content: 

| Field name   | Field value           |
| ------------ | --------------------- |
| title        | sensitve pampers      |
| path         | pampers.com/sensitive |
| label        | wipes                 |
| introduction | { introduction }      |

{ introduction } : Pampers Swaddlers diapers are the number one choice of hospitals, based on, protection, comfort, dryness and more. Buy now at Pampers.com

3. A function to create a field name "slug" - short text with the value found in the title field.
Published the content. 
4. create a log file (log.txt) in the following format 
    DATE: Wed May 03 2023 10:47:22 GMT+0400 (Mauritius Standard Time)
    Published "filed Name"- id: "ID"
5. Create another another field called "US shop" in boolean type with default value true
6. append your log file with successful or unsuccessful response (in the same format above)
7. Delete the field "Shop" 
append your log file with successful or unsuccessful response (in the same format above)

---

## How to run the script

The **main** function is where you would run your tasks

![](../../Pictures/Screenshots/Screenshot%202023-05-09%20120026.png)

### Operations

| Operations      | Function    | Parameters | Return |
| --------------- | ----------- | ---------- | ------ |
| Connect to CMA  | connect     |            | env    |
| Create an entry | createEntry | env, entry |
| Create a field  | createField | env, field |
| Update a field  | updateField | env, field |
| Delete a field  | deleteField | env, field |


**Note: **

Re-running the script as it is would cause an error, which will be catched in a catch statement and be logged to *log.txt*.
Plausible scenario: Creating the same field twice.

- Since, the function createField does not check if the field already exists, an error will be caught and logged.

---

Thank you for your attention,
If you have any suggestions, please let me know. :smiley: