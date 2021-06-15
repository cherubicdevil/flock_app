import React from 'react';
import {ScrollView, View,Text} from 'react-native';
import OfficialDoc from './OfficialDoc';

const Terms = ({navigation}) => {

    const contentsList = contents.split('\n\n\n')

    return <OfficialDoc navigation={navigation} title="Terms/Conditions">
        <ScrollView style={{marginBottom: 100}}>
{contentsList.map((item)=>{
return <View style={{marginVertical: 20}}>
    <Text>{item}</Text>
</View>

    })}
    </ScrollView>
    </OfficialDoc>
};

export default Terms;

const contents = `The following Terms of Service (“Terms”) between you (“you” or “your”) and Shop with Flock, Inc. (“we,” “our,” “us,” or “SWF”) describes the terms and conditions on which you may access and use the SWF website located at borrowtherunway.com (the “Site”), the SWF mobile app (the “App”) and related services including SWF’s product borrow and sale services (together with the Site, the App, and the SWF Content, as defined below, the “Services”). These Terms also apply to in-store borrows and sales, which are part of the Services. By accessing or using any of the Services, you acknowledge that you have read, understood and agreed to be bound by these Terms.

 

PLEASE READ THESE TERMS CAREFULLY. THESE TERMS MAY HAVE CHANGED SINCE YOU LAST ACCESSED OR USED THE SERVICES. BY CLICKING “I AGREE” OR OTHERWISE ACCESSING OR USING ANY PART OF THE SERVICES, YOU AGREE TO THESE TERMS.

 

Notice of Agreement to Arbitrate and Class Action Waiver

By accepting these Terms, you are agreeing to the arbitration agreement and class action waiver contained in Section 8 of these Terms below.

 

 

    ABOUT THE SERVICES

 

    Introduction

Through the Services, we aim to give you access to beautiful designer clothing and accessories, stylist advice and other content.

 

    Mobile Charges

To the extent you access the Services through a mobile or wireless device, your carrier’s standard charges, data rates and other fees may apply.

 

    Eligibility

Children under the age of 13 may not use the Services and paborrows or legal guardians may not agree to these Terms on their behalf. Children under 18 years of age but at least 13 years of age may use the Site and App under the supervision of paborrows or legal guardians who agree to be bound by these Terms on their behalf, but such children may not borrow or purchase any clothing or accessories (“Products”) via the Services. If you are a paborrow or legal guardian agreeing to these Terms for the benefit of a child between the ages of 13 and 18, you are fully responsible for his or her use of the Services and the borrow or purchase of any Products, including all legal liability he or she may incur.

 

    Modification of the Services or the Terms

SWF may modify these Terms or modify, suspend, or discontinue the Services at any time for any reason. However, SWF will use commercially reasonable efforts to notify you of material changes to these Terms by posting a notice on the Site and/or sending an email to the email address you provided to SWF.

 

    Privacy

To learn more about our privacy practices, please read our Privacy Policy.

 

    BORROW AND PURCHASE OF PRODUCTS

 

    General Conditions

 

The Services include the borrow and sale of Products. This Section 2(A) sets out terms and conditions that apply to your borrow or purchase of any Product.

 

18 YEARS OR OLDER. Products may be borrowed or purchased for use by individuals under 18 years of age, but we borrow and sell only to adults, who may borrow or purchase the Products with a payment card or other approved payment method. By clicking agreeing to these Terms, you represent that you are 18 years or older and that you are authorized to use the chosen payment method (including, without limitation, credit cards) for the purpose of borrowing or purchasing the Products as described in these Terms.

 

LIMITS. You acknowledge and agree that we may place limits on the borrow or purchase of Products, including but not limited to restricting orders placed under a single customer account, payment card or billing or shipping address. We reserve the right to limit, cancel or prohibit any borrows or sales of Products for any reason in our sole discretion, including but not limited to availability and geographic concerns.

 

DELIVERY. Your Products may be ordered and couriered to you through SWF’s shipping partners, which may change from time to time at SWF’s discretion. The shipping method used will be at the discretion of SWF.

 

COLLECTIONS. If you do not pay the amounts you owe to SWF when due, then SWF will need to institute collection procedures. You agree to pay SWF’s costs of collection, including without limitation reasonable attorneys’ fees.

 

COMMUNICATIONS. You consent to receive communications from us, including email, text messages, calls, and push notifications, including for the purposes of notifying you about the status of your order, sending you reminders, facilitating secondary authentication, and providing other information. We may contact you by telephone calls or text messages, including by an automatic telephone dialing system, at any of the telephone numbers provided by you. Standard message and data rates charged by your mobile carrier may apply to the text messages we send you. You may opt out of receiving communications by following the unsubscribe procedures we provide to you. In the case of text messages, you may opt out by replying “STOP” to a text message you receive from us or by emailing info@shopwithflock.com. You acknowledge that opting out of receiving communications may impact your use of the Services.”

 

    Borrows

The following additional conditions apply to the borrow of any Product.

 

BORROW FEE. The borrow fee (“Borrow Fee”) for the Product will be the total of the borrow fee, insurance charges and delivery charges listed on the Site or App for your borrow of the Product. When you place your borrow order for a Product, you hereby authorize SWF to charge your payment card for the Borrow Fee. SWF will charge your payment card the amount of the Borrow Fee immediately upon your borrow order. A reservation of a Product on the Site or App is an order for the borrow of that Product, regardless of how far in advance that Product is reserved. In addition, at the time of your borrow order for a Product, you hereby authorize SWF to charge your payment card for an amount equal to 150% of the original retail value of the Product (when new) set forth on the Site or App (“Retail Value”) plus applicable sales taxes; provided that SWF will only charge your payment card for an amount greater than the Borrow Fee as described below. Borrow Fees exclude all federal, state and local taxes, GST, fees, customs, duties, levies and other governmental assessments, all of which shall be paid by you directly or, if paid by SWF, shall be paid by you to SWF in connection with your borrow order.

CANCELLATION POLICY. You may cancel your borrow order subject to the following cancellation fees and policies:

    If you cancel fourteen (14) or more days in advance of the delivery date, there is no cancellation fee and you will receive a full refund issued to the payment card you used for the order.
    If you cancel less than thirty (14) days but more than seven (7) days in advance of the delivery date, you will not receive any refund, but you will receive a full credit to your SWF account for the Borrow Fee associated with the cancelled order. This credit can be applied to any future SWF borrow.
    If you cancel seven (7) or fewer days in advance of the delivery date, you will receive a credit to your SWF account for the Borrow Fee associated with the cancelled order, minus a cancellation fee of $9.95.

 

RETURN. With delivery of the Product, SWF will provide you with a pre-paid, pre-addressed shipping label as well as instructions for your use in returning the Products to SWF or the next recipient.

 

RECEIPT OF THE PRODUCTS. Upon delivery, you bear responsibility for the Product(s). You acknowledge that a Secure Shipping Address is highly recommended. Furthermore, you acknowledge that providing anything other than a Secure Shipping Address may result in delivery delays and additional delivery fees for which SWF will not be liable. You will be liable for all such delays and additional delivery fees.

 

USE OF THE PRODUCTS. You agree to treat the Products with great care. You are responsible for loss, destruction or damage to the Products due to theft, mysterious disappearance, fire, major stains or any other cause, other than normal wear and tear. Normal wear and tear encompasses minor stains, rips, missing beads, stuck zippers or other minor damage. If you return a Product that is damaged beyond normal wear and tear, then you agree that we shall charge you, and you shall pay, for the price for repairing or replacing the Product, as determined in our discretion, up to 150% of the Retail Value for the Product.

 

LATE FEES. If you return the Products late or not at all, a late fee of 10% of the Retail Value will be charged to the payment card you used to pay the Borrow Fee or to any other payment card included in your account information that you have provided to SWF for every day that you are late returning the Products, and you agree to pay such late fees, up to an amount not to exceed 150% of the Retail Value plus applicable sales tax (plus the Borrow Fee). The late fee is payable for each order of Products that is not returned when due, not for each Product that is the subject of the order that is late. If you have not returned a Product within fifteen (15) days after the return date for the Product, your late return will be considered a non-return and SWF will charge your payment card the maximum late fee set forth in this Section 2(B), less any late fees that you have already paid, plus applicable sales tax.

 

PAYMENT OF 150% RETAIL VALUE SWF will not charge you for more than an amount equal to 150% of the Retail Value plus the Borrow Fee, in the aggregate, for any charges arising under this Section 2(B), excluding collection costs. If you pay SWF an amount equal to 150% of the Retail Value under this Section 2(B) and you still possess the Product, the Product is yours to keep, though on an “AS IS” basis without warranty of any kind. For the avoidance of doubt, the limitations of this clause shall not apply to the Flock/Borrow Fee, which is charged separately from, and in addition to, any other charges payable by you pursuant to this Section 2(B).

 

LIMITED WARRANTIES. The following are the limited warranties SWF provides in connection with Product borrows. SWF’s liability to you for failure to comply with any of these warranties is limited to timely delivery of Product conforming to the warranties or a refund of the Borrow Fee (excluding insurance and delivery charges) as determined by SWF. See Section 7(A) below.

    CORRECT PRODUCTS. Subject to availability, we will deliver the Products you ordered, including the specified size, color and design, on or before the delivery date for which you ordered them, except in the rare event that the Product is damaged beyond repair or there is an occurrence subsequent to the placing of the order that prevents timely delivery. In such event, we will use reasonable efforts to notify you that the Product is unavailable. If we are able to reach you, you will be entitled to choose any available borrow Product to replace the unavailable Product. If we are unable to reach you, you acknowledge and agree that we may send you a replacement product of the same or greater value. Products may appear different in color and style than as displayed on the Site or App.
    CLEAN AND READY TO WEAR. The Products will be professionally cleaned and delivered ready to wear. SWF dry cleans and inspects each Product with the utmost care, but use of the Product is at your own risk and SWF shall not be held liable for any health-related complaints associated with any Product.
    SIZING RETURNS. If your Product does not fit you, then you may return the Product to SWF within 24 hours (excluding Sundays and holidays) of the date you received the Product by contacting SWF at info@shopwithflock.com. SWF will then issue you a credit for the full Flock/Borrow Fee (less delivery charges) of the Product for a future borrow by you of our Products, so long as the Product, in our sole discretion, has not been worn.

 

    Flock Purchase

The following additional conditions apply to the flocking of any Product.

 

FLOCK FEE. The flock fee (“Flock Fee”) for the Product will be price you agreed to pay for your percent ownership of the Product, plus insurance charges and delivery charges listed on the Site or App for your flocking of the Product. When you place your flock order for a Product, you hereby authorize SWF to charge your payment card for the Flock Fee. SWF will charge your payment card the amount of the Flock Fee immediately upon completion of the flock. A reservation of a Product on the Site or App is an order for the flocking of that Product, regardless of how far in advance that Product is reserved. In addition, at the time of your flock order for a Product, you hereby authorize SWF to charge your payment card for an amount equal to 150% of the original retail value of the Product set forth on the Site or App (“Retail Value”) plus applicable sales taxes; provided that SWF will only charge your payment card for an amount greater than the Flock Fee as described below. Flock Fees exclude all federal, state and local taxes, GST, fees, customs, duties, levies and other governmental assessments, all of which shall be paid by you directly or, if paid by SWF, shall be paid by you to SWF in connection with your flock order.

CANCELLATION POLICY. You may cancel your flock order no less than three (3) days in advance of the delivery date.

 

RETURN. With delivery of the Product, SWF will provide you with a pre-paid, pre-addressed shipping label as well as instructions for your use in returning the Products to SWF or the next recipient.

 

RECEIPT OF THE PRODUCTS. Upon delivery, you bear responsibility for the Product(s). You acknowledge that a Secure Shipping Address is highly recommended. Furthermore, you acknowledge that providing anything other than a Secure Shipping Address may result in delivery delays and additional delivery fees for which SWF will not be liable. You will be liable for all such delays and additional delivery fees.

 

USE OF THE PRODUCTS. You agree to clean or professionally clean the Product after each use. You agree to treat the Products with great care. You are responsible for loss, destruction or damage to the Products due to theft, mysterious disappearance, fire, major stains or any other cause, other than normal wear and tear. Normal wear and tear encompasses minor stains, rips, missing beads, stuck zippers or other minor damage. If you return a Product that is unclean, then you agree that we shall charge you, and you shall pay, for the price of cleaning the Product, as determined in our discretion, up to $200.  If you return a Product that is damaged beyond normal wear and tear, then you agree that we shall charge you, and you shall pay, for the price for repairing or replacing the Product, as determined in our discretion, up to 150% of the Retail Value for the Product.

 

LATE FEES. If you return the Products late or not at all, a late fee of 10% of the Retail Value will be charged to the payment card you used to pay the Flock Fee or to any other payment card included in your account information that you have provided to SWF for every day that you are late returning the Products, and you agree to pay such late fees, up to an amount not to exceed 150% of the Retail Value plus applicable sales tax. The late fee is payable for each order of Products that is not returned when due, not for each Product that is the subject of the order that is late. If you have not returned a Product within fifteen (15) days after the return date for the Product, your late return will be considered a non-return and SWF will charge your payment card the maximum late fee set forth in this Section 2(B), less any late fees that you have already paid, plus applicable sales tax.

 

PAYMENT OF 150% RETAIL VALUE SWF will not charge you for more than an amount equal to 150% of the Retail Value plus the Flock Fee, in the aggregate, for any charges arising under this Section 2(B), excluding collection costs. If you pay SWF an amount equal to 150% of the Retail Value under this Section 2(B) and you still possess the Product, the Product is yours to keep, though on an “AS IS” basis without warranty of any kind. For the avoidance of doubt, the limitations of this clause shall not apply to the Flock/Borrow Fee, which is charged separately from, and in addition to, any other charges payable by you pursuant to this Section 2(B).

 

    Use of the Services

 

    SWF Content

 

CONTENT PROVIDED “AS IS.” All content and information available through the Services, including but not limited to product descriptions and specifications, product photos, advice from stylists and photos and comments from other users (“SWF Content”) is available to you on an “as is” basis and is to be used for general information purposes only. Such information is provided on a blind-basis, without any knowledge as to your identity or specific circumstances. The SWF Content is provided with the understanding that such information does not constitute professional advice or services. As such, you agree not to rely upon or use any SWF Content as a substitute for consultation with professional advisors. As used in these Terms, the Services include the SWF Content.

 

UPDATES We may update the SWF Content, including Product descriptions and specifications, as we deem appropriate and without notice to you. If you have any questions about the existence of more curborrow information, please send those questions to legalinfo@borrowtherunway.com. We take your questions and requests for information seriously, and we will use reasonable efforts to respond in a timely manner. However, we cannot guarantee a prompt response in all cases.

 

    Third Party Content

 

LINKS TO THIRD-PARTY WEBSITES. The Services may contain links or references to non-SWF websites, products, services or other materials or content (“Third Party Content”). This Third Party Content is provided to you as a convenience, and SWF is not responsible for any Third Party Content or the actions of those that provide or use such Third Party Content. Any Third Party Content is independent from SWF, and SWF has no control over the Third Party Content. In addition, a link to any Third Party Content does not imply that SWF endorses, approves of or accepts any responsibility for the Third Party Content or its provider, or vice versa.

 

    Acceptable Use Policy

 

USE OF SWF CONTENT. No part of the Services, including the SWF Content, may be reproduced or transmitted in any form, by any means, electronic or mechanical, including photocopying and recording, except that SWF authorizes you to view, copy, download, and print SWF Content (such as press releases and FAQs) that is available on the Site, provided that: (a) you use the SWF Content solely for your personal, noncommercial, informational purposes; (b) you do not modify the SWF Content; and (c) you do not remove any copyright, trademark, and other proprietary notices on the SWF Content.

 

USE OF THE SERVICES. You may not use the Services to: (i) transmit any content, information or other materials that are, or which SWF considers in its sole discretion to be, unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, offensive, obscene, pornographic, hateful or threatening to any group defined by race, religion, gender, national origin or sexual orientation, obscene, lewd, lascivious, violent, harassing or otherwise objectionable, including without limitation expressions of bigotry, prejudice, racism, hatred or profanity; (ii) sell or promote any products or services, including any controlled pharmaceutical substances, tobacco, fire arms, or alcoholic beverages; (iii) introduce viruses, worms, Trojan horses and/or harmful code; (iv) display material that exploits children under 18 years of age; (v) post any content, information or other materials that infringe, misappropriate or violate any intellectual property or other right of any third party; (vi) promote or solicit any business or promote, solicit or participate in multi-level marketing or pyramid schemes; impersonate any other person, including but not limited to, a SWF representative; (vii) post, collect or disclose any personally identifying information (including account names) or private information about children or any third parties without their consent (or their paborrow’s consent in case of a child under 13 years of age); (viii) post or transmit any unsolicited advertising, promotional materials, or any other forms of solicitation, including without limitation solicitations of credit card numbers, solicitations for sponsors, or promotion of raffles or contests; or (ix) violate any applicable local, state, national or international laws or regulations.
You also agree that you will not (and will not attempt to or permit any third party to): reverse engineer, decompile, disassemble, translate, derive the source code for, interfere with, borrow, sell or lease the Services, any part thereof or access thereto.

 

INDEMNIFICATION FOR BREACH. By using the Services, you agree to indemnify, hold harmless and defend SWF and its officers, directors, agents and affiliates from any claims, damages, losses, liabilities, and all costs and expenses of defense, including but not limited to, attorneys’ fees, resulting directly or indirectly from a claim by a third party that is based on your use of the Services in violation of these Terms.

 

    Your Content

 

If you post, upload or make available to SWF or the Services, or otherwise submit to or through SWF as part of your use of the Services, including the Site or App, any information, data, text, images, files, links, software, chat, communication or other materials, including but not limited to photos and reviews relating to your use of the Products (“Your Content”), you hereby grant to SWF a perpetual, non-exclusive, irrevocable, fully-paid, royalty-free, sub-licensable and transferable (in whole or part) worldwide license to use, reproduce, transmit, display, exhibit, distribute, index, comment on, modify, create derivative works based upon, perform and otherwise exploit Your Content and your name, image, voice, likeness and/or other biographical information or material in connection with Your Content, in whole or in part, in all media formats and distribution methods now known or hereafter devised (including on the Site and App, in email and other promotional campaigns and on third party sites promoting the Services) in connection with the Services, including but not limited to advertising, promoting, and marketing the Services, all without further notice to you, with or without attribution, without limitation as to frequency, and without the requirement of any permission from or payment to you or to any other person or entity. You waive any right to inspect or approve any of Your Content or any use of Your Content. By submitting Your Content, you represent and warrant that Your Content and your communication thereof conform to these Terms, including Section 4(C), and that you own or have the necessary rights, licenses, consents and permissions, without the need for any permission from or payment to any other person or entity, to exploit, and to authorize SWF to exploit, Your Content in all manners contemplated by these Terms. You waive all moral rights in Your Content which may be available to you in any part of the world and confirm that no such rights have been asserted. None of Your Content will be subject to any obligation, whether of confidentiality, attribution or otherwise, on our part and we will not be liable for any use or disclosure of any Your Content.

 

    Your Account

 

Access to parts of the Services requires the creation of a user account upon registration. You are solely responsible and liable for any authorized or unauthorized access to your account by any person. You agree to bear all responsibility for the confidentiality of your account information and all use or charges incurred from use of the Services with your account. You agree to notify SWF promptly of any unauthorized use of your account.

 

    Delays

 

There may be delays, omissions, or inaccuracies in the Services, including the SWF Content. The Service may become unavailable due to maintenance or malfunction of computer equipment or other reasons.

 

 

    INTELLECTUAL PROPERTY

 

    Ownership of the Services

 

The Services, including the SWF Content, including all intellectual property rights in and to the Services and any changes, modifications or corrections thereto, are the property of SWF and its affiliates and licensors, and are protected from unauthorized copying and dissemination by United States copyright law, trademark law, international conventions and other intellectual property laws. By way of example only, and not as a limitation, “Shop with Flock” and the SWF logo are registered trademarks of Shop with Flock, Inc., under the applicable laws of the United States and/or other countries. Other SWF product or service names or logos appearing on or through the Services are either trademarks or registered trademarks of SWF and/or its affiliates. All other product names are trademarks or registered trademarks of their respective owners. SWF and its affiliates and licensors reserve all rights in and to the Services not granted expressly in these Terms.

 

Nothing shall be construed as granting to you, by implication, estoppel, or otherwise, any license or right to use the Services or any SWF Content, through the use of framing or otherwise, except: (a) as expressly permitted by these Terms; or (b) with the prior written permission of SWF or such third party that may own such SWF Content.

 

    Services License

 

Subject to your compliance with these Terms, SWF grants to you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal, non-commercial purposes.

 

    App License

 

Subject to the terms of these Terms, SWF grants to you a limited, non-transferable, non-exclusive, revocable license to download, install and use one copy of the App in object code form only on an interactive wireless device that you own or control.

 

ACKNOWLEDGMENT. The following applies to you only if you are using the App from the Apple App Store. To the extent the other terms and conditions of these Terms are less restrictive than, or otherwise conflict with, the terms and conditions of this paragraph, the more restrictive or conflicting terms and conditions in this paragraph apply, but solely with respect to App from the Apple App Store. You acknowledge and agree that these Terms are solely between you and SWF, not Apple, and that Apple has no responsibility for the App or content thereof. Your use of the App must comply with the App Store Terms of Service. You acknowledge that Apple has no obligation whatsoever to furnish any maintenance and support services with respect to the App. In the event of any failure of the App to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price, if any, for the App to you; to the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to the App, and any other claims, losses, liabilities, damages, costs or expenses attributable to any failure to conform to any warranty will be solely governed by these Terms. You and SWF acknowledge that Apple is not responsible for addressing any claims of you or any third party relating to the App or your possession and/or use of the App, including, but not limited to: (i) product liability claims; (ii) any claim that the App fails to conform to any applicable legal or regulatory requirement; and (iii) claims arising under consumer protection or similar legislation. You and SWF acknowledge that, in the event of any third-party claim that the App or your possession and use of that App infringes that third party’s intellectual property rights, SWF, not Apple, will be solely responsible for the investigation, defense, settlement and discharge of any such intellectual property infringement claim to the extent required by these Terms. You must comply with applicable third party terms of agreement when using the App. You and SWF acknowledge and agree that Apple, and Apple’s subsidiaries, are third party beneficiaries of these Terms as they relate to your license of the App, and that, upon your acceptance of the Terms, Apple will have the right (and will be deemed to have accepted the right) to enforce these Terms against you as a third party beneficiary thereof.

 

    Feedback

 

By sending us any feedback, ideas, suggestions, documents or proposals (“Feedback”), you grant to us an irrevocable, non-exclusive, royalty-free, perpetual, worldwide license to use, modify, prepare derivative works of, publish, distribute, sublicense and otherwise exploit the Feedback, and you waive all moral rights in the Feedback which may be available to you in any part of the world and confirm that no such rights have been asserted. You represent and warrant that the Feedback does not contain any confidential or proprietary information of any third party, and that SWF may use your Feedback without restriction or obligation to you or any third party.

 

    Notice and Take Down Procedures; Copyright Agent

 

If you believe any SWF Content infringes your copyright, you may request removal of those materials (or access thereto) by contacting SWF’s copyright agent (identified below) and providing the following information: identification of the copyrighted work that you believe to be infringed, including a description of the work, and where possible a copy or the location (e.g., URL) of an authorized version of the work; identification of the material that you believe to be infringing and its location, including a description of the material and its URL or any other pertinent information that will allow us to locate the material; your name, address, telephone number and e-mail address; a statement that you have a good faith belief that the complained of use of the materials is not authorized by the copyright owner, its agent, or the law; a statement that the information that you have supplied is accurate, and indicating that “under penalty of perjury,” you are the copyright owner or are authorized to act on the copyright owner’s behalf; and a signature or the electronic equivalent from the copyright holder or authorized representative.

 

 

    TERMINATION

 

    Termination By You

 

You may deactivate your account and discontinue your use of the Services at any time. In order to deactivate your account, please contact us at info@shopwithflock.com. You understand that Your Content may continue to exist and be used on or through the Service even after such deactivation.

 

    Termination By SWF

 

Any violation of these Terms may result in suspension or termination of your access to the Services and/or removal of Your Content. SWF may also terminate your account if SWF determines that your conduct poses a risk or liability to SWF, or for any other reason as determined by SWF in its sole discretion.

 

    Effects of Termination

 

In each of these cases, the Terms will terminate, including your license to use the Services, except that the following sections shall continue to apply: 2(A) (Collections), 2(B) (Flock/Borrow Fee, Late Fees), 2(C), 3(A) (Failure to Pay Fees), 4(A)-(D), 5(A), 5(C) (Acknowledgment), 5(D), 6(C), and 7-9, including the mandatory arbitration and class-action waiver provisions.

 

    DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY

 

    Limited Warranties

 

The limited warranties set out in Section 2(B) for borrows apply only to you and may not be assigned, sold or transferred to any third party. No other warranties are granted by SWF in connection with the Services or Products. The limited warranties shall not apply to any matters arising from your violation of these Terms.

 

Your sole and exclusive remedy and SWF’s sole and exclusive liability for a breach by SWF of the limited warranties set out in Section 2(B) shall be, at SWF’s option, SWF’s use of its commercially reasonable efforts to replace the non-conforming Product in a timely manner or a refund of your Flock/Borrow Fee, as applicable (excluding insurance and delivery charges).

 

    Disclaimer of Warranties

 

EXCEPT FOR THE LIMITED WARRANTIES SET OUT IN SECTION 2(B), THE SERVICES AND PRODUCTS, INCLUDING ALL TRIAL PROGRAMS, ARE PROVIDED “AS IS” WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING WITHOUT LIMITATION THE WARRANTIES OF MERCHANTABILITY, QUALITY OR FITNESS FOR A PARTICULAR USE. SPECIFICALLY, BUT WITHOUT LIMITATION, SWF DOES NOT WARRANT THAT: (I) THE SERVICES, INCLUDING THE SWF CONTENT, ARE CORRECT, ACCURATE, RELIABLE OR COMPLETE; (II) THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE; (III) DEFECTS WILL BE CORRECTED, (IV) THE SERVICES OR THE SERVER(S) THAT MAKES THE SERVICES AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR (V) THE PRODUCTS WILL BE FIT FOR YOUR INTENDED PURPOSE OR OTHERWISE ACCORD WITH YOUR EXPECTATIONS. THIS DISCLAIMER DOES NOT APPLY TO NEW JERSEY RESIDENTS OR TRANSACTIONS OR WHERE OTHERWISE PROHIBITED BY LAW.

 

    Limitation of Liability

 

UNDER NO CIRCUMSTANCES SHALL SWF BE LIABLE FOR ANY DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, MULTIPLE OR OTHER DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE USE OF, OR THE INABILITY TO USE, THE SERVICES AND/OR THE PRODUCTS, EVEN IF SWF HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOUR SOLE AND EXCLUSIVE REMEDY HEREUNDER SHALL BE AS SET FORTH UNDER SECTION 7(A) OR TO DISCONTINUE YOUR USE OF THE SERVICES AND TERMINATE THESE TERMS. THE FOREGOING LIMITATION OF LIABILITY DOES NOT APPLY TO NEW JERSEY RESIDENTS OR TRANSACTIONS OR WHERE OTHERWISE PROHIBITED BY LAW.

 

    DISPUTE RESOLUTION, ARBITRATION AND CLASS ACTION WAIVER

 

This Section 8 includes an arbitration agreement and an agreement that all claims will be brought either in arbitration or in small claims court and, in either case, only in an individual capacity (and not as a class action or other representative proceeding). Please read it carefully.

 

    Informal Process First

 

Both you and SWF agree that in the event of any dispute between us, you and SWF will first contact the other party and make a good faith sustained effort to resolve the dispute before resorting to more formal means of resolution.

 

    Mandatory Arbitration of Disputes

 

All disputes between you and SWF will be resolved by BINDING ARBITRATION. YOU HEREBY AGREE TO GIVE UP YOUR RIGHT TO GO TO COURT to assert or defend your rights under this contract, except for matters that may be taken to small claims court. Your rights will be determined by a neutral arbitrator, NOT a judge or jury. You agree that any dispute arising out of or relating to this Agreement, including with respect to the interpretation of any provision of this Agreement or concerning the performance or obligations of SWF or you, shall be resolved by mandatory and binding arbitration submitted to JAMS in accordance with its Commercial Arbitration Rules at the request of either SWF or you pursuant to the following conditions:

 

(a) Place of Arbitration Hearings. Unless you elect to conduct the arbitration by telephone or written submission, an in-person arbitration hearing will conducted at a JAMS facility in your area or at a JAMS facility in San Francisco.

 

(b) Selection of Arbitrator shall be made pursuant to JAMS’ Streamlined Arbitration Rules & Procedures or JAMS’ Comprehensive Arbitration Rules & Procedures, depending on the amount of the claim as specified herein.

 

(c) Conduct of Arbitration. The arbitration shall be conducted by a single neutral arbitrator under JAMS’ Streamlined Arbitration Rules & Procedures. For claims exceeding $5,000.00, the arbitration shall be conducted under JAMS’ Comprehensive Arbitration Rules & Procedures Subject to the applicable JAMS procedure, the arbitrator shall allow reasonable discovery in the forms permitted by the Federal Rules of Civil Procedure, to the extent consistent with the purpose of the arbitration. The arbitrator(s) shall have no power or authority to amend or disregard any provision of this section or any other provision of these Terms of Service, except as necessary to comply with JAMS’ Policy on Consumer Arbitrations Pursuant to Pre-Dispute Clauses Minimum Standards of Procedural Fairness. The arbitration hearing shall be commenced promptly and conducted expeditiously. If more than one day is necessary, the arbitration hearing shall be conducted on consecutive days unless otherwise agreed in writing by the parties.

 

(d) Findings and Conclusions. The arbitrator(s) shall, after reaching judgment and award, prepare and distribute to the parties written findings of fact and conclusions of law relevant to such judgment and award and containing an opinion setting forth the reasons for the giving or denial of any award. The award of the arbitrator(s) shall be final and binding on the parties, and judgment thereon may be entered in a court of competent jurisdiction.

 

(e) Costs and Fees. You will be subject to a $250 filing fee to initiate an arbitration. To the extent permitted by JAMS procedures, each party shall bear its own costs and expenses and an equal share of the arbitrators’ and administrative fees of arbitration, with SWF remaining responsible for its share of costs, expenses and fees plus any costs, expenses and fees required of it under JAMS procedures.

 

(f) Litigation. The Federal Arbitration Act and federal arbitration law apply to this Agreement. Either party also may, without waiving any remedy under this Agreement, seek from any court having jurisdiction any interim or provisional relief that is necessary to protect the rights or property of that party, pending the establishment of the arbitral tribunal (or pending the arbitral tribunal’s determination of the merits of the controversy). We also both agree that you or we may bring suit in court to enjoin infringement or other misuse of intellectual property rights.

 

(g) Other. The Federal Arbitration Act and federal arbitration law apply to these Terms and Conditions.

 

    Class Action Waiver

 

The parties expressly waive any ability to maintain any class action in any forum. Any arbitration, claim or other proceedings by or between you and SWF shall be conducted on an individual basis and not in any class action, mass action, or on a consolidated or representative basis. You further agree that the arbitrator shall have no authority to award class-wide relief or to combine or aggregate similar claims or unrelated transactions. You acknowledge and agree that this agreement specifically prohibits you from commencing arbitration proceedings as a representative of others. If for any reason a claim proceeds in court rather than in arbitration, we each waive any right to a jury trial. Any claim that all or part of this Class Action Waiver is unenforceable, unconscionable, void, or voidable may be determined only by a court of competent jurisdiction and not by an arbitrator.

 

    MISCELLANEOUS

 

JURISDICTIONAL ISSUES. SWF makes no representation that the Services are appropriate or available for use outside the United States. Those who choose to access the Services or any part thereof from outside the United States do so at their own risk and are responsible for compliance with applicable local laws. The Services may contain references or cross references to products or services that are not available or approved by the appropriate regulatory authorities in your country. Such references do not imply that SWF intends to announce or make available such products or services to the general public, or in your country. Contact SWF at help@borrowtherunway.com to determine which products and services may be available to you.

 

EXPORT LAWS. The laws of the United States of America prohibit the export of certain software and data to particular persons, territories, and foreign states. You agree not to export the Services, including the SWF Content, or any part thereof, in any way, in violation of United States law.

 

GOVERNING LAW AND VENUE. These Terms are governed and interpreted pursuant to the laws of the State of New York, notwithstanding any principles of conflicts of law. Any disputes in connection with these Terms that, notwithstanding the mandatory arbitration provision we have agreed to above, results in court action, shall be resolved exclusively by a state or federal court located in New York County, New York, and you specifically consent to the personal jurisdiction of such courts and waive any claim of forum non conveniens.

 

ENTIRE AGREEMENT. These Terms are the entire agreement between you and SWF relating to the subject matter herein and shall not be modified except by SWF in accordance with these Terms, or as otherwise agreed in writing by you and SWF. No employee, agent or other representative of SWF has any authority to bind SWF with respect to any statement, representation, warranty or other expression not specifically set forth in these Terms.

 

SEVERABILITY AND WAIVER. If any part of these terms is unlawful, void, or unenforceable, that part will be deemed severable and will not affect the validity and enforceability of the remaining provisions. The preceding sentence does not apply to New Jersey residents or transactions. The failure of a party to require performance of any provision will not affect such party’s right to require performance at any time thereafter, nor shall a waiver of any breach or default of these Terms or any provision of these Terms constitute a waiver of any subsequent breach or default or a waiver of the provision itself.

 

ASSIGNMENT. You may not assign or transfer these Terms or any of your rights or obligations under these Terms. SWF may assign these Terms at any time without notice to you.

 

FORCE MAJEURE. SWF will not be liable for, or be considered to be in breach of these Terms on account of, any delay or failure to perform as required by these Terms as a result of any cause or condition beyond SWF’s reasonable control.

 

CONTACT INFORMATION. Please send any questions or comments, or report violations of these Terms, to info@shopwithflock.com.`