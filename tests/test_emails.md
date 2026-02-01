# Test Email Dataset for PO Management System
## 50 Edge Case Emails for Testing

---

### 1. Standard Format - Baseline
```
Subject: PO Update - PO-45821

Hi,

Your order PO-45821 from Acme Supplies is on track.

Expected ship date: Jan 15, 2024
Items: 500x Widget A, 200x Widget B

Thanks,
Acme Supplies Team
```

---

### 2. Multiple PO IDs in One Email
```
From: orders@multivendor.com
Subject: Batch Update - Multiple Orders

We're updating you on several orders:

PO-1001: On track, ships Feb 1
PO-1002: Delayed due to weather
PO-1003: Already shipped yesterday

Items vary by order. Contact us for details.

MultiVendor Solutions
```

---

### 3. No Clear PO ID Format
```
Subject: Your order update

Hello,

Order reference: Customer_2024_Alpha_123

We're processing your widgets (250 units) and expect to ship by January 28th.

Status: Manufacturing in progress

Best,
Generic Supplier Inc
```

---

### 4. Embedded HTML/Rich Text
```
Subject: <b>IMPORTANT</b> Order PO-9988 Update

<html>
<body>
<p>Dear Customer,</p>
<p><strong>PO Number:</strong> PO-9988</p>
<p><strong>Status:</strong> <span style="color:green">SHIPPED</span></p>
<p>Items: <ul><li>100x Gadget Pro</li><li>50x Accessory Kit</li></ul></p>
<p>Expected Delivery: 2024-02-15</p>
</body>
</html>
```

---

### 5. Non-English Characters & Unicode
```
Subject: Commande PO-FR-2024-001 - Mise à jour

Bonjour,

Votre commande PO-FR-2024-001 est en cours.

Articles: 500× Composant Ω, 200× Résistance μ
Date prévue: 15 février 2024

Fournisseur: TechPièces François™

Cordialement,
L'équipe
```

---

### 6. All CAPS Aggressive Format
```
SUBJECT: URGENT!!! PO-EMERGENCY-9999 CRITICAL UPDATE!!!

ATTENTION REQUIRED IMMEDIATELY!!!

PO NUMBER: PO-EMERGENCY-9999
STATUS: MAJOR SHIPMENT DELAY!!!
SUPPLIER: SCREAMING LOGISTICS LLC

YOUR ORDER OF 1000X PARTS IS DELAYED BY 3 WEEKS!!!

EXPECTED: FEB 1 2024
REVISED: FEB 22 2024

THIS IS NOT A DRILL!!!
```

---

### 7. Minimal Information
```
PO88 - shipped

- Supplier X
```

---

### 8. Overly Verbose Corporate Format
```
Subject: Re: Fw: Re: Following Up on Our Previous Correspondence Regarding Purchase Order PO-CORP-2024-Q1-00456-REV2

Dear Valued Customer and Esteemed Business Partner,

We hope this electronic correspondence finds you in good health and high spirits. 

Pursuant to our ongoing business relationship and in accordance with the terms and conditions outlined in our master service agreement dated December 15, 2023, we are writing to provide you with a comprehensive status update regarding the aforementioned purchase order, specifically identified as PO-CORP-2024-Q1-00456-REV2.

Current Status: The order is progressing satisfactorily within expected parameters
Supplier Entity: MegaCorp International Business Solutions, Ltd.
Commodity Line Items: Three hundred (300) units of Component Z (Part Number: CZ-1337-A)
Anticipated Fulfillment Date: The fifth day of February in the year 2024

Should you require any additional information, clarification, or have any questions, concerns, or feedback, please do not hesitate to contact our customer service department.

Warm regards and best wishes,
The MegaCorp Team
```

---

### 9. Missing Date Format
```
Subject: Update on order REF#12345

Hi there,

Your order REF#12345 from QuickParts is ready to ship soon.

Items: 75x Bolt Set, 25x Washer Pack

We'll let you know when it goes out!

Cheers
```

---

### 10. Date Ambiguity (MM/DD vs DD/MM)
```
Subject: PO-DATE-TEST shipment

Purchase Order: PO-DATE-TEST
Ship Date: 03/04/2024
Items: 100x Test Component
Supplier: DateConfusion Inc

Is this March 4th or April 3rd? Good luck!
```

---

### 11. Multiple Date Formats
```
From: chaos@suppliers.net
Subject: PO-MULTI-DATE update

Order: PO-MULTI-DATE

Original date: 2024/01/15
Revised date: Jan 20th, 2024
Current ETA: 25-01-2024
Final delivery: January 30

Supplier: Format Chaos Ltd
Items: 500x Mixed Parts
```

---

### 12. Negative/Cancellation Notice
```
Subject: CANCELLATION - PO-9876 CANCELLED

Dear Customer,

We regret to inform you that order PO-9876 has been CANCELLED at your request.

This order will not be fulfilled.

Supplier: CancelCo
Items: N/A (cancelled)
Status: VOID
```

---

### 13. Partial Shipment
```
Subject: Partial Shipment - PO-SPLIT-123

Hello,

We're shipping your order PO-SPLIT-123 in multiple parts:

SHIPPED TODAY:
- 200x Widget A (out of 500 ordered)

STILL PENDING:
- 300x Widget A (ships next week)
- 100x Widget B (ships Feb 10)

Supplier: PartialShip Co
Expected completion: Feb 10, 2024
```

---

### 14. Status Update Without Clear Status
```
From: vague@suppliers.com
Subject: About your order PO-VAGUE-001

Hi,

Just wanted to let you know we're working on PO-VAGUE-001.

Things are happening. We'll update you later.

Items: Some stuff you ordered
Supplier: Vague Suppliers Inc
```

---

### 15. Attachment Reference (No Actual Attachment)
```
Subject: PO-ATTACH-555 - See attached invoice

Dear Customer,

Please find attached the shipping details for PO-ATTACH-555.

The attachment includes:
- Full item breakdown
- Tracking information
- Expected delivery dates

Supplier: AttachmentOnly Corp
*Note: This is a test email with no actual attachment*
```

---

### 16. Special Characters in PO ID
```
Subject: Order Update

Purchase Order: PO#2024/01-A&B_v2.5@final
Status: On Track
Items: 300x Component @#$%
Expected: 2024-02-01
Supplier: Special!Char$Inc
```

---

### 17. Very Long PO ID
```
From: enterprise@bigsupplier.com
Subject: Order Confirmation

PO Number: ENTERPRISE-GLOBAL-SUPPLY-CHAIN-MANAGEMENT-SYSTEM-PURCHASE-ORDER-2024-Q1-NORTH-AMERICA-REGION-ELECTRONICS-DIVISION-SUBSECTION-A-12345678

Status: Processing
Items: 1000x Enterprise Widget
Expected: March 1, 2024
Supplier: EnterpriseGlobalSupplyChainManagementCorp
```

---

### 18. Quantity Variations
```
Subject: PO-QTY-999 Update

Order PO-QTY-999 status:

Items:
- One thousand two hundred (1,200) units of Part A
- 500 pieces of Part B
- Part C: quantity 300
- 75x Part D
- Part E: 1.5K units
- 2k of Part F

Expected: Feb 5, 2024
Supplier: QuantityMix LLC
Status: On Track
```

---

### 19. Time Included with Dates
```
Subject: Precise Timing - PO-TIME-123

Purchase Order: PO-TIME-123
Ship Date: 2024-01-15 14:30:00 EST
Expected Delivery: Jan 20, 2024 09:00 AM PST
Items: 250x Time-Sensitive Component
Supplier: PrecisionTime Inc
Status: Shipped at 2:30 PM on the 15th
```

---

### 20. Reply Chain Noise
```
Subject: Re: Re: Re: Fw: Re: PO-CHAIN-777 Question

On Jan 10, 2024 at 3:45 PM, customer@company.com wrote:
> Can you check on PO-CHAIN-777?
>
>> On Jan 9, 2024, supplier wrote:
>> We'll look into it
>>
>>> On Jan 8, 2024, customer wrote:
>>> Thanks for the update
>>>
>>>> Original message from Jan 7:
>>>> Your order is processing

YES! PO-CHAIN-777 is SHIPPED!

Items: 500x Nested Reply Parts
Expected: Jan 25, 2024
Supplier: EmailChain Logistics

[Previous 47 messages hidden]
```

---

### 21. Mixed Status Indicators
```
From: confusing@status.com
Subject: PO-MIX-STATUS Update

Order: PO-MIX-STATUS

The order is on-track but we're experiencing product delays. However, it shipped yesterday but there's a shipment delay. Everything is fine but we're behind schedule. It's both early and late.

Items: 100x Schrödinger's Widget
Supplier: QuantumState Supplies
Expected: TBD (or already arrived?)
```

---

### 22. Currency Symbols & Pricing (Should be Ignored)
```
Subject: Invoice & Shipping - PO-PRICE-001

Order: PO-PRICE-001
Status: Shipped

Items:
- 100x Premium Widget @ $25.99 ea = $2,599.00
- 50x Standard Widget @ €19.99 ea = €999.50
- Shipping: £150.00
- Total: $3,500 (approx)

Expected delivery: Feb 1, 2024
Supplier: GlobalPricing Ltd
```

---

### 23. Emoji and Modern Communication
```
Subject: 🚀 PO-EMOJI-2024 Shipped! 🎉

Hey! 👋

Great news! Your order PO-EMOJI-2024 is on its way! 📦✈️

Items: 
- 500x Cool Gadget 😎
- 200x Awesome Thing 🔥

Expected: Feb 5, 2024 📅
Status: SHIPPED ✅

Your supplier,
Modern Tech Co 💯
```

---

### 24. Legal Disclaimer Overload
```
Subject: PO-LEGAL-123 Update

CONFIDENTIAL AND PROPRIETARY - DO NOT FORWARD

Purchase Order: PO-LEGAL-123
Status: On Track
Items: 300x Legal Widget
Expected: Feb 10, 2024
Supplier: LegalEase Corp

NOTICE: This email and any attachments are confidential and may contain proprietary information. If you are not the intended recipient, please delete immediately. This email does not constitute a binding contract. All dates are estimates only. We reserve the right to modify quantities and specifications. By reading this email you agree to our terms of service available at www.legalease.com/tos. Any use of this information requires written consent. Please consult your attorney before making any decisions based on this communication. This message has been scanned for viruses. However, we cannot guarantee complete security...

[Legal disclaimer continues for 50 more lines]
```

---

### 25. Completely Unstructured
```
hey its me from the warehouse we got ur order ready i think it was po-something-456 or maybe 457? anyway we got like 200 of those things u wanted and some other stuff too should ship next week or the week after depending on the truck schedule hit me back if u need anything else

- jimmy
warehouse guy
that supplier place
```

---

### 26. Auto-Reply/Out of Office
```
Subject: Automatic reply: PO-AUTO-999 Update

I am currently out of the office with limited access to email.

For urgent matters regarding PO-AUTO-999, please contact our customer service team at support@supplier.com.

I will respond to your inquiry when I return on February 15, 2024.

This is an automated message. Please do not reply.

Best regards,
Sales Team
BigSupplier Corp
```

---

### 27. Backwards Date (Year First)
```
Subject: Order Update 2024/PO/001

Purchase Order: 2024/PO/001
Shipment Date: 2024-31-01 (YYYY-DD-MM format)
Items: 400x International Component
Supplier: DateBackwards International
Status: Shipped

Delivery expected: 2024-05-02
```

---

### 28. Missing Line Breaks
```
Subject: PO-NOBREAKS-111
Order PO-NOBREAKS-111 from OneLineCorp is ready. Items: 600x Compact Widget, 300x Small Part. Expected: Feb 1, 2024. Status: Shipped. Tracking: 1Z999XX. Contact: support@onelinecorp.com. Thanks!
```

---

### 29. Excessive Line Breaks
```
Subject: PO-BREAKS-222 Update







Purchase Order: PO-BREAKS-222




Status: On Track




Items:

100x Spaced Widget

50x Airy Component




Expected: Feb 10, 2024




Supplier: 


ExtraSpace LLC




```

---

### 30. Mixed Language
```
Subject: Actualización de Pedido - PO-LANG-MIX-777

Hello,

Su orden PO-LANG-MIX-777 está on track.

Items: 200x Multilingual Widget, 100x Polyglot Part
Expected delivery date: 5 de febrero de 2024

Status: 発送済み (Shipped)

Gracias,
Global Lingua Suppliers
```

---

### 31. Scientific Notation Quantities
```
Subject: High Volume Order - PO-SCI-2024

Order: PO-SCI-2024
Items: 
- 2.5e3 units of Micro Component (that's 2,500)
- 1.0E+02 units of Standard Part (100 units)
- 5e2 Bulk Items

Expected: 2024-02-15
Supplier: ScienceSupply Inc
Status: Processing
```

---

### 32. Fake/Phishing Email Pattern
```
Subject: URGENT: Verify Your Order PO-PHISH-999 NOW!!!

Dear Valued Customer,

We have detected unusual activity on your order PO-PHISH-999.

CLICK HERE to verify your account: http://definitely-not-suspicious.ru/verify

Your order of 999x Suspicious Widget will be CANCELLED if you don't respond within 24 hours!

Expected: Unknown
Supplier: TotallyLegit Corp (Based in Nigeria)
Status: URGENT ACTION REQUIRED

Send us your credit card details to proceed.

Best Regards,
Not A Scammer
```

---

### 33. Encoded/Escaped Characters
```
Subject: PO Update - PO&#45;ENCODE&#45;123

Purchase Order: PO&amp;ENCODE&amp;123
Status: On&nbsp;Track

Items:
&#8211; 100&times; Widget&trade;
&#8211; 50&times; Component&reg;

Expected: Feb&nbsp;1,&nbsp;2024
Supplier: Encoded&copy;Supplies&nbsp;Inc
```

---

### 34. Different Time Zones
```
Subject: Global Shipment - PO-TZ-2024

Order: PO-TZ-2024

Ship Date: Jan 15, 2024 10:00 GMT
Expected Arrival: Jan 20, 2024 14:30 EST (19:30 GMT)
Alternate ETA: Jan 21, 2024 06:30 AEST

Items: 300x Timezone Widget
Supplier: GlobalTime Logistics
Status: In Transit (currently over Pacific Ocean)
```

---

### 35. JSON/XML in Email Body
```
Subject: API Notification - PO-API-555

{
  "purchase_order": "PO-API-555",
  "status": "shipped",
  "items": [
    {"name": "API Widget", "quantity": 250},
    {"name": "JSON Part", "quantity": 100}
  ],
  "expected_delivery": "2024-02-05",
  "supplier": "TechData Systems"
}

This is an automated notification from our system.
```

---

### 36. Markdown Formatting
```
Subject: PO-MD-2024 Update

# Purchase Order Update

## Order Details
**PO Number:** PO-MD-2024  
**Status:** *Shipped*  
**Supplier:** MarkdownSupplies Ltd

### Items
- 100x **Bold Widget**
- 50x *Italic Component*
- 25x `Code Part`

#### Expected Delivery
> February 10, 2024

---

For questions, contact: support@mdsupplies.com
```

---

### 37. Signature Block Chaos
```
Subject: PO-SIG-777 Ships Today

Your order PO-SIG-777 is shipping today!

Items: 200x Widget, 100x Part
Expected: Jan 25, 2024

Thanks,

John Smith
Senior Account Manager
BigSupplier Corporation
1234 Industrial Pkwy, Suite 500
Manufacturing City, ST 12345
Phone: +1 (555) 123-4567
Mobile: +1 (555) 987-6543
Fax: +1 (555) 123-4568
Email: jsmith@bigsupplier.com
Web: www.bigsupplier.com

[Logo Image]

CONFIDENTIALITY NOTICE: This email may contain confidential information...
Please consider the environment before printing this email 🌳
Connect with us: [LinkedIn] [Twitter] [Facebook] [Instagram]

Winner of "Best Supplier 2023" award by Industry Magazine
ISO 9001:2015 Certified | AS9100 Certified | ITAR Registered
```

---

### 38. Only Subject Line Info
```
Subject: PO-SUBJ-ONLY-999 Shipped Feb1 - 500xWidgets - FastShip Co - OnTrack
```

---

### 39. Duplicate Information
```
Subject: Order Update PO-DUP-123

Purchase Order: PO-DUP-123
PO Number: PO-DUP-123
Order ID: PO-DUP-123
Reference: PO-DUP-123

Status: Shipped
Current Status: Shipped  
Order Status: Shipped

Items: 100x Widget A, 100x Widget A, 100x Widget A
Products: 100x Widget A

Expected: Feb 1, 2024
ETA: Feb 1, 2024
Delivery Date: February 1, 2024
Expected Arrival: 02/01/2024

Supplier: DuplicateCorp
Vendor: DuplicateCorp
From: DuplicateCorp
```

---

### 40. Ancient Email Client Format
```
Subject: PO-OLD-1999

X-Mailer: Netscape Mail 4.0
MIME-Version: 1.0
Content-Type: text/plain; charset=us-ascii

> Order Number: PO-OLD-1999
> Status......: Shipped
> Items.......: 250x Legacy Component
> Expected....: 02/15/2024
> Supplier....: OldSchool Systems

Sent from my Blackberry... just kidding, it's 2024!

_____________________________
This email sent via dial-up modem
```

---

### 41. Mobile Typos and Auto-Correct
```
Subject: Quick update on PO-MOBILE-555

Hey!

Your order PO-MOBILE-555 form Fasthsip Co is gunna ship tomorow.

Items: 300x wodgets (widgets), 150x compnents (components)

Exoected date: Fen 5 (Feb 5, 2024)

Status: on track

Sent from my iPhone, sorry for typos!
```

---

### 42. Temperature/Weather Delay
```
Subject: Weather Delay Notice - PO-SNOW-2024

WEATHER ALERT

Order: PO-SNOW-2024
Status: SHIPMENT DELAY

Due to severe winter storm conditions in the Northeast, your shipment is delayed.

Original ETA: Jan 20, 2024
Revised ETA: Jan 27, 2024 (weather permitting)

Items: 500x Cold-Weather Widget
Supplier: NorthernSupplies Inc

Current Temperature at warehouse: -15°F (-26°C)
Road Status: Closed

We'll update you when conditions improve.
```

---

### 43. Merger/Company Name Change
```
Subject: Important Notice - PO-MERGER-001

COMPANY ANNOUNCEMENT

Effective immediately, OldCorp Inc. has merged with NewTech Solutions.

Your order PO-MERGER-001 originally from OldCorp will now be fulfilled by:
**NewTech Solutions (formerly OldCorp Inc.)**

Order status: On Track (no delays due to merger)
Items: 200x Transition Widget
Expected: Feb 10, 2024

All future correspondence will come from @newtech.com email addresses.

Your order reference remains: PO-MERGER-001
```

---

### 44. Quality Issue / Return Notice
```
Subject: QUALITY ALERT - PO-DEFECT-777

IMPORTANT QUALITY NOTICE

Order: PO-DEFECT-777
Status: PRODUCT DELAY

During final quality inspection, we discovered a defect in batch #4567.

Items affected:
- 500x Premium Widget (FAILED QC)

We are manufacturing replacement units.

Original delivery: Jan 25, 2024
New estimated delivery: Feb 15, 2024

Supplier: QualityFirst Manufacturing
Reason: Coating thickness below specification

We apologize for this delay but refuse to ship substandard products.
```

---

### 45. Customs/Import Delay
```
Subject: Customs Hold - PO-IMPORT-2024-INT

INTERNATIONAL SHIPPING NOTICE

Purchase Order: PO-IMPORT-2024-INT
Status: SHIPMENT DELAY - Customs Hold

Your order from overseas supplier is held at customs for inspection.

Items: 1000x International Component
Origin: Shenzhen, China
Destination: Los Angeles, USA

Shipped: Jan 15, 2024
Arrived at Port: Jan 20, 2024
Customs Status: PENDING INSPECTION
Expected Release: Jan 25-30, 2024

Final Delivery (estimated): Feb 5, 2024

Supplier: Pacific Import/Export Ltd
Customs Ref: USLA-2024-009876

We'll notify you once customs clearance is complete.
```

---

### 46. Subscription/Recurring Order
```
Subject: Recurring Order Confirmation - PO-RECUR-JAN-2024

SUBSCRIPTION ORDER PROCESSED

This is your monthly recurring order:

Order ID: PO-RECUR-JAN-2024 (January 2024)
Previous Order: PO-RECUR-DEC-2023
Next Order: PO-RECUR-FEB-2024 (scheduled for Feb 1)

Items: 100x Monthly Widget (same as always)
Expected Delivery: Jan 25, 2024
Status: Processing

Supplier: SubscriptionSupplies Co

To modify or cancel your subscription, contact us before Feb 1.
```

---

### 47. Force Majeure / Disaster
```
Subject: CRITICAL DELAY - PO-DISASTER-2024

FORCE MAJEURE NOTICE

Order: PO-DISASTER-2024
Status: SEVERE PRODUCT DELAY

Our manufacturing facility in Austin, TX experienced a major power outage due to grid failure affecting the entire region.

Impact on your order:
Items: 750x Electronic Component
Original delivery: Jan 30, 2024
**Revised delivery: March 15, 2024** (6-week delay)

Supplier: AustinTech Manufacturing

We are working with alternate facilities but cannot expedite due to specialized equipment requirements.

This delay is beyond our control and falls under Force Majeure provisions.

We sincerely apologize for this situation.
```

---

### 48. Drop Ship / Third Party
```
Subject: Drop Ship Notice - PO-DROP-333

THIRD PARTY FULFILLMENT NOTICE

Your order PO-DROP-333 placed with MiddleMan Distributors will be fulfilled by our partner warehouse.

Original Supplier: MiddleMan Distributors
Actual Fulfillment: DirectWarehouse LLC
Ship-From Location: Memphis, TN (not our usual facility)

Items: 400x Drop-Ship Widget
Expected: Feb 1, 2024
Status: Processing at partner facility

Tracking information will come from DirectWarehouse LLC.

This is normal for certain high-volume items.

Contact MiddleMan for any questions.
```

---

### 49. Price Increase Notice (Mixed with PO Update)
```
Subject: PO-PRICE-CHANGE-555 Shipping + Important Notice

Good news: Your order PO-PRICE-CHANGE-555 is shipping today!

Items: 300x Widget Model A
Expected Delivery: Jan 28, 2024
Status: SHIPPED
Supplier: ValueSupplies Inc

---

IMPORTANT NOTICE FOR FUTURE ORDERS:

Effective February 1, 2024, prices for Widget Model A will increase by 15% due to raw material costs.

Your current order (PO-PRICE-CHANGE-555) is at the old price.

Future orders will reflect new pricing.

Contact your account manager with questions.
```

---

### 50. The Perfect Storm (Everything at Once)
```
Subject: Re: Fw: URGENT!!! 🚨 PO#2024/SPECIAL-001-REV3-FINAL_v2 Update!!!

On 1/15/2024 at 14:30:00 EST, support@chaossupplier.com wrote:
> CONFIDENTIAL - DO NOT FORWARD
>
>> Previous message chain [Hidden]

MULTI-STATUS UPDATE & NOTICES

**Purchase Orders:** PO#2024/SPECIAL-001-REV3-FINAL_v2 (also known as: ORDER-001, Ref#ABC123)

📦 **Status Update:**
- Part 1: SHIPPED ✅ (200x Widget A) - Tracking: 1Z999-CHAOS
- Part 2: PRODUCT DELAY ⚠️ (300x Widget B) - QC issues found  
- Part 3: SHIPMENT DELAY 🚛 (100x Widget C) - Customs hold
- Part 4: CANCELLED ❌ (50x Widget D) - Discontinued

**Supplier Info:**
OldCorp-NewTech Merged Solutions LLC™ (formerly ChaosSupplier Co)
[MERGER EFFECTIVE JAN 1, 2024]

**Dates & Times:**
- Original ETA: 2024-01-20 10:00 GMT
- Revised ETA Part 1: DELIVERED (Jan 15 @ 2:30 PM)
- Revised ETA Part 2: TBD (Feb 15-Mar 1 estimate)
- Revised ETA Part 3: 02/05/2024 (pending customs)
- Part 4: N/A (cancelled)

**Items en Français:**
- Deux cent (200) × Widget™ Type-A @ $25.99 = $5,198.00
- Three hundred (3e2) × Widget® Tipo-B [DELAYED]
- 100 pieces Widget-C [EN DOUANE]
- 50pc Widget-D ❌

**Special Notes:**
⚠️ Price increase effective Feb 1 (+15%)
🌡️ Weather delay in Memphis warehouse (-10°F)  
🏭 Manufacturing at alternate facility (China → Vietnam)
✈️ Drop-shipped via third-party: FastGlobal Logistics International Express Ltd Inc.
📋 Requires signature upon delivery
♻️ Please recycle packaging materials

**Legal Notice:**
This email may contain confidential información. Por favor considere el environment...

[Previous 83 messages not shown]

---
Sent from my iPhone via satellite connection during polar vortex ❄️
DO NOT REPLY TO THIS EMAIL - Use support portal instead

[Automatic Signature]
Juan María O'Connor-Smith III, MBA, PhD 🎓
Chief Chaos Coordination Officer
OldCorp-NewTech Merged Solutions™
☎️ +1-555-0123 ext.456 📱 +1-555-CHAOS ✉️ chaos@supplier.com
🌐 www.wemergeddidntwetellyyou.biz
LinkedIn | Twitter | MySpace | GeoCities

ISO-9001 | AS9100 | ITAR | GDPR | HIPAA | BBB | OMG | WTF

Winner: "Most Confusing Email Format 2024" 🏆

CONFIDENTIALITY: If you received this by mistake, please delete it, forget you saw it, tell no one, burn your computer, move to another country, and assume a new identity.

Think Green 🌳 - Do not print (but if you do, please print 47 copies and distribute to random people)
```

---

## Edge Case Summary

These 50 emails test:
- ✅ Standard formats (emails 1, 9, 18)
- ✅ Multiple PO IDs in one email (2)
- ✅ Missing/unclear PO formats (3, 7, 16, 17)
- ✅ HTML/rich text (4)
- ✅ Non-English & Unicode (5, 30)
- ✅ All caps/aggressive (6)
- ✅ Minimal information (7)
- ✅ Verbose corporate (8)
- ✅ Date format variations (10, 11, 19, 27)
- ✅ Missing dates (9)
- ✅ Cancellations (12)
- ✅ Partial shipments (13)
- ✅ Vague status (14)
- ✅ Special characters (16, 33)
- ✅ Long PO IDs (17)
- ✅ Quantity variations (18, 31)
- ✅ Time zones (19, 34)
- ✅ Email chains/replies (20)
- ✅ Conflicting status (21)
- ✅ Pricing info to ignore (22)
- ✅ Emojis (23)
- ✅ Legal disclaimers (24)
- ✅ Unstructured text (25)
- ✅ Auto-replies (26)
- ✅ Formatting issues (28, 29, 36, 37)
- ✅ Mixed languages (30)
- ✅ Phishing patterns (32)
- ✅ Encoded characters (33)
- ✅ JSON/API formats (35)
- ✅ Subject-only info (38)
- ✅ Duplicates (39)
- ✅ Legacy formats (40)
- ✅ Mobile typos (41)
- ✅ Real-world delays (42, 44, 45, 47)
- ✅ Company changes (43)
- ✅ Recurring orders (46)
- ✅ Drop shipping (48)
- ✅ Price changes (49)
- ✅ Combined chaos (50)
