DISCLAIMER: This document is to serve as a reference and not the anchor as the tables have evolved over time. The purpose of referencing this document is for inspiration and benchmarking. 

# 01. _Users (in)

Stores all UserID accounts that was first created by an emDash user. The UserID has access to all Communications and Messages sent directly to the UserID or via the userTypeID if a paid subscriber. 

This class requires a callSign that will used for throughout the user's journey in emDash and also determines the only three userTypes i.e., 1) Player, 2) Supervisor or 3) Enabler which are all directly linked to one natural human legal adult or minor. 

The assigned userType (whether **PlayerID, SuperID, or EnablerID**) along with the **callSign** value acts as a verifier when investigating the interactions among other classes.  

<mark style="background: #F77EE1;">Also, this class takes **non-paid members** (those with a **UserID** but not an **userTypeID**) into account by allowing them to have access to the most basic Dashboard configuration (i.e., to complete onboarding process) where materials, listings, and/or rankings are not disclosed. </mark>

The **Players(Select)**---however, are eligible to apply for a Scholarship where emDash distributes free Activity slots to selected candidates that have completed a task (i.e., *650 word essay*) 

**ScholarshipRecipients** will have a sneak peak into the Dashboard configuration for the respective Activity the Player(Select) engaged with and have access to the deliverables that are associated with being a paid subscriber.  

emDash playGround rewards users paying attendance and showing dedication. This Class collects all log in and log out states to keep track of the visitors' patterns and frequencies. A list of Roll Calls and Public Access Badges will be used to justify awarding Scholarship Activities to committed Player(Select)s. 

userType(Select): offer selected features 
 - **Player(Select)**: Public Access Badges & Resources + Scholarship Activity 
 - **Supervisor(Select)**: Consent to Activities & Resources  
 - **Enabler(Select)**: [Guest Adjudicators]

Users with no userTypeID will not be able to send or receive messages and subsequently Invitations. They will only receive Communications from emDash. 


## 01. Users Class

##### `1.1 UserID`: objectId
##### `1.2 callSign`: String 
(required, all user MUST have a username within emDash)
##### `1.3 password`: String 
(required, ensure encryption) 
##### `1.4 email`: String
(required)
##### <mark style="background: #F77EE1;">`1.51 PlayerID`: Pointer (to Player class)</mark> 
^ `2.1 PlayerID`
(one of three required, direct pointer)
##### <mark style="background: #F77EE1;">`1.52 SuperID`: Pointer (to Supervisor class) </mark>
^ `4.1 SuperID`
(one of three required, direct pointer)
##### <mark style="background: #F77EE1;">`1.53 EnablerID`: Pointer (to Enabler class) </mark>
^ `8.1 EnablerID`
(one of three required, direct pointer)
##### `1.6 ProfileImage`: <mark style="background: #068408;">Pointer (to FileUpload class)</mark>
^ `35.1 FileID`
(optional, to FileUpload Class; FileID, all users MAY have a profile image)
##### <mark style="background: #068408;">`1.7 lastLogin`: Date</mark>


# 02. AC_Players (in)

The emDash playGround was designed and built for Players. Supervisors and Enablers are there on the Ground to ensure that the "Player Experience" addresses both intrisinic and extrinsic motivators, thereby generating both meaningful and substantive results. 

Intrinisic motivators (e.g., persistence, curiosity, or yearning) nuture self-awareness and soulWork while extrinsic motivators (e.g., win/loss, ranking, or constructive feedback) offer new ways of seeing and conjuring our World. 

In order to treat competence and compassion of equal status, one must learn discipline, have a desire to win, and the sheer will to overcome obstacles. Equally important but often overlooked, is that person's extraordinary ability to strictly adhere to the Golden Rule: *Don't do anything you wouldn't want on the receiving end.*  

Players in emDash are encouraged to interact with other bright minds (of similar age) all around the world so they can receive feedback on their performances, learn more about themselves and be better prepared to lead a professional and sovereign life. 

UserIDs with a `PlayerID` value are referred to as **Players**

Players must complete the Onboarding Process in order to have access to all the features of the emDash playGround via the following steps: 

**PI)** Legal Natural Person Auth + Link Supervisor UserID (email) 
 - firstName, lastName, School, Location, Grade (in terms of GradYear), 
**PII)** Complete Personality Profile (displaying Profile optional)
 - MBTI four letters, OCEAN scores, 
**PIII)** Confirm assigned Divison and send a "Thank you" Message to SuperID


### <u>Description:</u> (Player Stories)

Requests custody to `Supervisor` (; who approves and links up to six `Players`)
Completes Player Onboarding (optional: `PersonalityProfile` for a `Badge`)
Be assigned a `Division` automatically upon Summer Solstice every year
Completes (a series of) task(s) to earn `Badges`

Creates a `TeamID` and becomes a `TeamFounder`
Views Teams for assigned `Division`
Requests to join a `Team` 

Views Activities (`Event` or `Exercise`) for assigned `Division`
Registers for an `ActivityID`
Invites other Teams to registered `ActivityID`
Accepts or declines invitations from other Teams 

Sends and receives `Messages` to affiliated TeamMates
Receives `Communications` from emDash
Only `TeamFounder` Sends and receives `Messages` to `Enablers` (; who cannot initiate a `Message` and only respond) 
`TeamFounder` `Message` always includes `TeamMates` and `Supervisor` 

Confirms completion of `ActivityID`
Views a `Ballot` from each `Enabler` (; who submits a Ballot)
Views `Scores` and `Feedback` in each `Ballot`

Views `ResourceMaterials` available to all Players 
Submit a `ResourceReview` for each `32.1 ResourceID`
Views own `playerAnalytics` 
Views own `PlayerRankings`
Views affiliated `TeamRankings`
Views `HallOfGame` Ranking Chart 
Offers a `Clap` for exemplary feedback from `Enabler` in a `Ballot`


&mdash;


&#151;




## 02. Players Class

##### `2.1 PlayerID`: objectId
##### `2.2 firstName`: String 
##### `2.3 lastName`: String 
##### `2.4 dateOfBirth`: Date 
##### `2.5 School`: String 
##### `2.6 Location`: String 
##### <mark style="background: #068408;">`2.7 GradYear`: String</mark>
([backend logic] add dropdown logic to update annually upon summer solstice)
dropdown values: 

<mark style="background: #F77EE1;">(in Noodl, I change the Grad Year annually)
</mark>

![[Pasted image 20240502133031.png]]

##### `2.8 DivisionID`: Pointer
^cfdc1d `9.1 DivisionID`
(conditional, to Division class; DivisionID)
##### <mark style="background: #068408;">`2.9 UserID`: Pointer</mark>
^9c3f6a `1.1 UserID`
(required, to Users class; UserID)
##### `2.10 DivisionHistory`: <mark style="background: #F77EE1;"> Relation (to Division class)</mark>
<mark style="background: #068408;">(optional, when applicable, list all previous DivGenIDs associated with the PlayerID; long-term commitment is reward via tie-breaker in scholarship allocation)</mark>
##### `2.13 analyticsReference`: Pointer
^9f0e20 `11.1 analyticsID`
(to playerAnalytics class; analyticsID)
##### `2.14 LinkedSuperID`: <mark style="background: #068408;">Pointer (ADDED)</mark>
^ `4.1 SuperID`
(conditional, Supervisors Class, upon SuperID payment and LinkedPlayer setup)

##### <mark style="background: #068408;">`2.15 showPersonality`: Boolean (ADDED 240625)</mark>


# 03. AD_PlayerBadges (in)

Stores how many Badges were EarnedFor which reasons and to how many Players. 

Player(Select)s will be eligible to apply for an emDash Scholarship Activity by completing the free public access Badges availabe upon signing up with the UserID. 

## 03. PlayerBadges Class

##### `3.1 PlayerBadgeID`: objectId
##### `3.2 PlayerID`: Pointer 
^17a366 `2.1 PlayerID`
(to Players class; PlayerID)
##### `3.3 BadgeID`: Pointer 
^76764e `22.1 BadgeID`
(to Badges class; BadgeID)
##### `3.4 EarnedFor`: String 
(e.g., 10 exercises, 3 tournaments)

# 04. AE_Supervisors (in)


Supervisors serve as the legal respresentation for all PlayerIDs by linking each with the associated SuperID. The only userType that pays USD (KRW) to emDash playGround. 

Supervisors + up to six (6) Players: 

A Supervisor must link Players in order to complete the Onboarding Process and this is also a requirement for the Players. 

Supervisors serve a legal capacity in that any disputes, conflicts and violations with other paid-members (esp. among Players) will be addressed to this legal guardian. The emDash Organizing Committee shall hear both parties and mediate a resolution. If a resolution cannot be reached within the proceedings defined by the emDash OC PROTOCOL, emDash will cooperate to both sides on providing the requested documentation. 

Moreover, since SuperIDs are solely responsible for paying and/or approving Tuition for a given Activity, all transaction details must be logged and organized to create a clear Audit Trail to ensure transparency and data integrity. 

UserIDs with the `Supervisor` Enum value are referred to as **Supervisor(Select)**

Supervisors must complete the Onboarding Process in order to have access to all the features of the emDash playGround via the following steps: 

**SI)** Legal Natural Person Authentication 
 - firstName, lastName, contactNumber, 
**SII)** Proof of Enrollment & Link Player(s) 
 - School documents in PDF
 - Consent to Terms & Agreement assuming legal responsibilities of Linked Players  
**SIII)** Subscription Plan and metaPass Addon
 - Quarterly or Annual Subscription Plan 
 - metaPass ("quick checkout") Addon for the duration of said Plan 

## 04. Supervisors Class

##### `4.1 SuperID`: objectId 
##### `4.2 firstName`: String
##### `4.3 lastName`: String
##### `4.4 contactNumber`: String
##### `4.5 LinkedPlayers`: <mark style="background: #068408;">Relation (to Players Class)</mark>
^ad1916 `2.1 PlayerID`
(required, to Players class, up to six PlayerID) 
##### `4.6 SubscriptionID`: Pointer 
^114297 `5.1 SubscriptionID`
(conditional, upon successful payment; to Subscriptions class)
##### `4.7 lastBalance`: Pointer
^112601 `31.1 emCoinTransactionID`
(as needed, to emCoinTransactions class; emCoinTransactionID for the most recent balance)
##### <mark style="background: #068408;">`4.8  UserID`: Pointer</mark>
^0aaea0 `1.1 UserID`
(to Users class; UserID)

## Replaced

##### `4.9 enrollmentCert`: <mark style="background: #068408;">Relation (to FileUpload Class) (240702 moved to AK Invitations)</mark> 
^ `35.1 FileID`
(conditional, to FileUpload Class; FileID, to upload school enrollment documentation for each Player) 
<mark style="background: #F77EE1;">(Note: files are accessible via url)</mark>


# 05. AF_Subscriptions (in)


Subscriptions serve as the barrier between paid and non-paid members. The former will provided the SuperID and Linked PlayerIDs with all the features prepared for the Ground. The latter will only view selected features to complete onboarding and/or earn Badges to be eligible for the Scholarship Pool. 

Subscribed members enjoy full access to: 
 - All Resource Materials 
 - All Activities
 - Personalized Analytics 
 - emCoinTransactions History
 - Invitation-Only Hall of Game Events and Exercises 

&mdash;

Subscription with Addon must generate a new `6.1 mpAddOnID`

&#151;

## 05. Subscriptions Class

##### `5.1 SubscriptionID`: objectId
##### `5.2 SuperID`: Pointer 
^8f3b8e `4.1 SuperID`
(required, to Supervisors class; SuperID) 
##### `5.3 planType`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `90_Days`
 - `90_Days+metaPass`
 - `Annual`
 - `Annual+metaPass`
##### `5.5 EndDate`: Date
(optional, 90 days or 365 days from "createdAt" date) 
##### `5.6 TotalAmount`: Number
(required, to match planType)
##### `5.7 ActiveStatus`: Boolean
(conditional, switch to false if renewal not completed)


# 06. AG_metaPassAddOns (in)

Stores all metaPassAddons (i.e., SuperIDs) for a given SubscriptionID. USD(KRW) transactions are stored in this Class as well as emCoinTransactions since new coins must be added to the balance. 

As the name suggest, metaPass in emDash allows SuperIDs to make quick and easy emCoin payments by prepaying for them at a discounted price instead of having to go through a Payment Gateway per each purchase. 

Whether via metaPass or Toss Payments API, all SuperIDs make payments for emDash Activities in emCoins but the former enjoys the following. 

Benefits of the metaPass Addon involve: 
 - Additional emCoins to engage in more Activities 
 - Option to contribute to the Scholarship Pool by setting a quota of your choosing (in terms of %) to be collected each quarter
 - Become eligible for the Scholarship Pool 

Since emCoins are only valid during the subscription period, emDash must keep track of the Addon members and track their spending patterns to offer a more granular pricing schema that better fits the users' schedules and budgets. 

## 06. metaPassAddOns Class
##### `6.1 mpAddOnID`: objectId

##### <mark style="background: #068408;">`6.2 SuperID`: Pointer</mark>
^573919 `4.1 SuperID`
(required, Supervisors Class; SuperID)
##### <mark style="background: #068408;">`6.3 LinkedPlayerID`: Relation</mark>
^355562 `2.1 PlayerID`
(required, Players Class; PlayerID)
##### <mark style="background: #068408;">`6.4 SubscriptionID`: Pointer</mark>
^ `5.1 SubscriptionID`
(required, Subscriptions Class; SubscriptionID)
##### `6.5 amountPrepaid`: Number
^9c04a6 `6.7 emCoinDeposit`
(to Toss Payments for the amount paid for AddOn)
(to compare with Subscription class; `5.3 planType` & `5.6 TotalAmount`)
##### `6.6 Balance`: Number
^c338f4 SuperID for `4.7 lastBalance`
(Backend Logic To be fed to the SuperID dashboard for emCoin Balance)
##### `6.7 emCoinDeposit`: Number 
(Backend Logic `6.5 amountPrepaid` multiply 150% before and 161.8% after launching "Scholarships" )
(to emCoinsTransactions class when making a deposit of emCoins)
##### `6.6 quotaPerQuarter`: Number
(Backend Logic to be adjusted each quarter and to verify the transfer over to the Scholarship pool, where emDash keeps logs and allocates for Activities)
##### `6.7 ScholarshipPoolDonation`: Number
(amount to be deducted if quotaPerQuarter is not depleted)
(Backend Logic to take the value from `6.6 quotaPerQuarter` and compare it `4.7 lastBalance` with upon deadline)

# 07. AH_ScholarshipPool (in)

Stores all Scholarship Activities issued by emDash.  

emDash offers Scholarship Activities to qualified Candidates and Scholarships are awarded to Players or Player(Select)s in the form of completing payment on their behalf for said Scholarship Activity.

All emCoins transferred from the unused metaPass quarterly quota are logged and distributed to Players and Player(Select)s that were deemed to show excellence upon internal emDash review. 

If the Activity is not taken up, then the Recipient is either still 1) Pending or has 2) Declined the Scholarship Activity.  

Should a Recipient decline the Scholarship, it will be offered to the next in line. 

## 07. Scholarship Pool Class

##### `7.1 ScholarshipID`: objectId 
##### `7.2 Amount`: Number (in emCoins)
##### `7.3 AllocationDate`: Date
##### `7.4 CandidateID`: <mark style="background: #068408;">Relation (to Players Class)</mark> 
^6c98fb `2.1 PlayerID`
##### `7.5 ActivityID`: <mark style="background: #068408;">Relation</mark> 
^9c3caa `12.1 ActivityID`
(to Activities class; ActivityID)
##### `7.6 ScholarshipType`: <mark style="background: #068408;">String</mark> 
(Values:) 
 - `Financial Aid (FA)`
 - `Exemplary Performance (XP)`
##### `7.7 Description`: String 
##### `7.8 Criteria`: String 
##### `7.9 SponsorID`: <mark style="background: #068408;">Relation (to Supervisors Class)</mark>
^942edb `4.1 SuperID`
(to Supervisors Class; SuperID or string value: External Sponsor)


# 08. AI_Enablers (in)

Stores all Enabler accounts issued by emDash upon completing the onboaring process per each Level. 

Lv. 1 Adjudicator (Content Contributer)
 - Submit Ballots 
Lv. 2 Instructor (Content Performer)
 - Submit Ballots, Teach Exercises, & Create Resources
Lv. 3 Educator (Content Creator)
 - Submit Ballots, Teach Exercises, & Create Activities + Resources

| --- | Adjudicator (Lv. 1) | Instructor (Lv. 2) | Educator (Lv. 3) | 
| --- | --- | --- | --- | 
| Submit Ballots | Check | Check | Check | 
| Teach Exercises | --- | Check | Check | 
| Create Resources | --- | Check | Check | 
| Create Activities | --- | --- | Check | 


references to the analytics data accessed or utilized by the enabler for various purposes, ensuring a track of analytics interaction.


UserIDs with the `Enabler` Enum value referred to as **Enabler(Select)**

Enablers must complete the Onboarding Process in order to have access to all the features of the emDash playGround via the following steps: 

**EI)** Legal Natural Person Authentication + Profile
 - firstName, lastName, contactNumber

**EII)** Complete Tasks Per Certification Level
 - Lv.1: number of Ballots submitted, clapCount, accessedAnalytics etc. 
 - Lv.2: number of Resources authored or curated, AverageRating, ReviewCount etc.  
 - Lv.3: (via performance metrics on Teaching Exercises) 
 
**EIII)** Confirm paymentInfo
 - paymentMethod, paymentDetail, paymentFrequencyPreference etc. 


## 08. Enablers Class

##### `8.1 EnablerID`: objectId 
(Unique identifier for both Adjudicators and Instructors)
##### `8.2 firstName`: String
##### `8.3 lastName`: String
##### `8.4 contactNumber`: String
##### <mark style="background: #068408;">``8.5 EnablerCertID`: Pointer</mark>
^ `10.1 EnablerCertID`
(conditional, upon successful Certification, to EnablerCertification class; EnablerCertID)
##### <mark style="background: #068408;">`8.6 UserID`: Pointer</mark>
^bf3d91 `1.1 UserID`
(to Users class; UserID) 
##### `8.7 Bio`: String 
(required, brief intro)
##### `8.8 ClapCount`: number
^e8a258 `17.13 clappedBy`
(calculate number from `17.13 clappedBy` of all submitted Ballots)
<mark style="background: #F77EE1;">(NOTE: may accidently add more claps, need to verify)</mark>
##### `8.9 Role`: <mark style="background: #F77EE1;"> String</mark>
(Values:) 
 - `Pending`
 - `Adjudicator(Lv.1)` 
 - `Instructor(Lv.2)`
 - `Educator(Lv.3)`
 - `Guest_Lecturer`
<mark style="background: #F77EE1;">(NOTE: ACL settings ROLE check --> ID check)</mark>
##### `8.10 accessedAnalytics`: <mark style="background: #068408;">Relation</mark>
^ffa009 `11.1 analyticsID`
(conditional, to playerAnalytics class; analyticsID)


# 09. AJ_Division (in)

Stores all Division assignments of all PlayerIDs
To be updated upon Summer Solstice of each year by the following Grades: 
 - Village: Grades 4~5
 - Lower: Grades 6~7
 - Upper: Grades 8~9
 - Senior: Grades 10~12

Each Player is assigned a Division upon completing the onboarding process and emDash will automatically reassign to the next Division as the grade number increases (i.e., compare with Graduation Year) 

## 09. Division Class
##### `9.1 DivisionID`: objectId
##### `9.2 DivisionName`: <mark style="background: #F77EE1;"> String</mark> 
 - `VILLAGE_(G4/Y5+G5/Y6)`
 - `LOWER_(G6/Y7+G7/Y8)`
 - `UPPER_(G8/Y9+G9/Y10)`
 - `SENIOR_(G10/Y11toG12/Y13)`
##### `9.3 GradeRange`: String/Array 
(Use GradYear for grade  e.g., 2032 = G4)
 - `G4/Y5+G5/Y6`
 - `G6/Y7+G7/Y8`
 - `G8/Y9+G9/Y10`
 - `G10/Y11toG12/Y13`
##### `9.4 StartingDate`: Date 
(when Division starts)
##### `9.5 EndingDate`: Date 
(when Division ends)
##### <mark style="background: #068408;">`9.6 AcademicYear`: String </mark> 
<mark style="background: #F77EE1;">(EDIT: to specify the exact year where the divisions were assigned, e.g., four DivisionIDs for 2024-2025 Academic Year and another four DivisionIDs for the 2025-2026 Academic Year)</mark>
##### <mark style="background: #068408;">`9.7 GenreID`: Pointer </mark>
^ `33.1 GenreID` 
(optional, to Genre Class; GenreID)
<mark style="background: #F77EE1;">(EDIT: changed to optional 240712)</mark>

# 10. BA_EnablerCertifications (in)

Stores all Certificates issued to Enablers.  

## 10. EnablerCertifications Class
##### `10.1 EnablerCertID`: objectId
##### `10.2 EnablerID`: Pointer 
^fd8d54 `8.1 EnablerID`
(to Enablers class, EnablerID)
##### `10.3 CertID`: Pointer 
^53da4d `21.1 CertID`
(to Certifications class; CertID)
##### `10.4 ExpirationDate`: Date
##### <mark style="background: #068408;">`10.5 AwardedFor`: String</mark>

# 11. BB_playerAnalytics (in) (deliberate JSON config)

Stores all customized playerAnalytics to track various performance metrics via human and machine feedback.  

Each Activity a Player engages in will generate Ballot(s) from Enabler(s). By using data from both the collected Ballots as well as the actual recording Activity Instance, emDash can now curate and optimize customized playerAnalytics to track progress on various performance metrics. These include: 

Machine feedback
 - (From Ballots) scores, time taken, error made for PlayerID, other associated TeamMates and TeamFounders 
 - (From Recordings) grammar, volume (in decibels), pronuniciation, auto-caption (ask for GPT Ballot) etc. 

Human feedback
 - (From Ballots) written feedback on overall performance and way forward 
 - (From Recordings) timestamped and directly comments on specific moments 

#### <mark style="background: #068408;">(EDIT: One analyticsID per each Player for a given ActivityID. Note that Enablers do not receive analyticsID but only which tags were interacted. playerAnalytics class only involves Players. Perhaps show this feature after a certain number of rounds such as 6.)</mark>


## 11. playerAnalytics Class
##### `11.1 analyticsID`: objectID
^c65160
##### `11.2 PlayerID`: pointer 
^a2bbdb `2.1 PlayerID`
(required, to Player class; PlayerID)
##### `11.3 ActivityID`: Pointer 
^1ac177 `12.1 ActivityID`
(required, to Activities class; ActivityID)
##### `11.4 BallotResults`: <mark style="background: #068408;">Relation</mark>
^d10dce `17.1 BallotID`
(required, to Ballots class; BallotID, <mark style="background: #068408;">each Player is expected to have three BallotIDs rendered for each ActivityID</mark>) 
##### `11.5 performanceMetrics`: Object
(e.g., scores, time taken, error made, etc.)
##### `11.6 comparisonMetrics`: Object
(e.g., average scores, peer performance etc.)
##### `11.7 improvementAreas`: <mark style="background: #068408;">String</mark>
(Key areas of focus)
##### `11.8 strengthAreas`: <mark style="background: #068408;">String</mark>
(Key areas of above average performance)
##### `11.9 Recommendations`: Object
(Customized recommendations for improvement strategies)
##### `11.10 EnablerInteraction`: <mark style="background: #068408;">Relation</mark>
^389cb5 `8.1 EnablerID`
(to Enablers class; EnablerIDs to track who interacted with the Player's performance)
##### `11.11 HistoricalData`: Object
(Achived data for reviewing progress over time)
##### `11.12 lastAnalyticsUpdate`: Date
(Timestamp of the last update)
##### `11.13 externalInfluences`: Object
(What external influences to track and how they will be quantified or categorized)
##### `11.14 trendsAndPatterns`: Object
(For longitudinal analysis, tracking trends and patterns over time to reveil growth, consistencies, or areas of recurring difficulties, use MBTI and OCEAN scores as a benchmark for customized analysis)
##### `11.15 engagementMetrics`: Object
(Metric to interpret enthusiasm, dedication, or areas of interest)
##### `11.16 ActivityPerformance`: Object
(repository of raw unprocessed data for a Player's performance in each Activity)

# 12. BC_Activities (in)

An ActivityID is a unique identifier for a specific activity registered by a group of Players and Enablers. 
Players and Enablers view a list of ActivityID Templates so they can create their own private chamber to process the registration. For a given ActivityID, an individual RegistrationID is generated for all participants and enablers. This allows the Admin to track which user is causing delays or not honoring the agreed upon itinerary.   

Stores all emDash Activities that are offered to the Players and Teams. All userTypes (including UserID) can view the available emDash Activities. This list will not be open to the Public except for "Feature" ActivityTypes as they are meant to welcome new Recipients from the ScholarshipPool. 

Activities are divided into Events or Exercises and may specify Solo entrants or allow both Teams and individual Players (as a Maverick) to register for a seat. Events comprise of Official Matches, Touranments, Hall of Game Invitationals, Awards, Competitions, Exhibitions as well as other formats where the results are logged in the public ledger: the Hall of Game Ranking Chart. 

Players and Teams must enroll into the Activity and the Supervisor must approve payment in order to secure the registered seat (and thus a new RegistrationID TICKET is VALIDATED.)

Conversely, Exercises include Weekly, Bi-weekly, Monthly Training Sessions, Boot Camps, Workshops, Seminars and many more curricula that all aims to better prepare Players and Player(Select)s for the upcoming Event. The results of Exercises are not recorded in the HallOfGame Class.    


PUBLIC: Player(Select) via UserID allowed: 
 - Feature Event (Scholarship)
 - Feature Exercise 

MEMBERS only: 
 - Solo Event (PlayerIDs only)
 - Solo Exercise
 - Team Event (PlayerIDs and TeamIDs)
 - Team Exercise 


Certain Activities (esp. Scholarship Pool) will require Players and Player(Select)s to sign a Release Form in case exerpts from the Activity Instance is suitable for social media outlets (i.e., YouTube, Twitch, & Twitter). Other Activities will ask for permission if said Activity is fair use for showcasing. 


## 12. Activities Class
##### `12.1 ActivityID`: objectId 
##### `12.2 Title`: String 
(EMD Summer Tournament 1 of 12)
##### `12.3 Description`: String 
(a series of Activities make up an Event / Exercise) 
##### `12.4 ActivityType`: <mark style="background: #F77EE1;"> String</mark>
(Values:) 
 - `OPEN_FeatEvent`
 - `OPEN_FeatExercise`
 - `MEMBERS_SoloEvent`
 - `MEMBERS_SoloExercise`
 - `MEMBERS_TeamEvent`
 - `MEMBERS_TeamExercise`
##### <mark style="background: #068408;">12.51 Divisions: Relation</mark> EDIT: 241127 
^ `9.1 DivisionID`
(to Divisions Class; DivisionID)
##### <mark style="background: #068408;">12.52 GenreID: Pointer</mark> 
^ `33.1 GenreID`
(to Genre Class; GenreID)
##### `12.6 StartDate`: Date(&Time)
(required, )
##### `12.7 EndDate`: Date(&Time)
(optional, )
##### `12.8 ChamberURL`: String 
(for the ActivityID designated Instance Chamber)
##### `12.9 acceptTerms`: Boolean 
(to the terms and conditions)
##### `12.10 releaseForm`: <mark style="background: #F77EE1;"> Relation (to User Class)</mark>
^ `1.1 UserID`
(ticked if requires Release Form in case of public showcase) 
("I agree" Popup when registering)
##### `12.11 MemberFee`: Number 
(only display to paid members)
##### `12.12 EnrollmentCapacity`: Number 
##### `12.13 EnrolledCount`: Number 
(not to exceed `12.12 EnrollmentCapacity` number value)
##### `12.15 ActivityFormat`: <mark style="background: #F77EE1;"> String</mark>
(Different set of Values per Genre:)
EMD DEBATE
 - `AsyncPairedMatch` 
 - `SyncPairedMatch` 
 - `Submission`
 - `Rolling`

MPED
 - `Submission`

CREM 
 - `Rolling`
##### `12.16 EnablerList: Relation (EDIT 241127)
(num. of available slots for Adjudicators)
##### <mark style="background: #F77EE1;">`12.171 TeamID`: Relation (to Teams Class)</mark>
^06e2cd `14.1 TeamID`
##### <mark style="background: #F77EE1;">`12.172 ParticipantID`: Relation (to Players Class)</mark>
^1e084c `2.1 PlayerID`
##### <mark style="background: #F77EE1;">`12.173 EnablerID`: Relation (to Enablers Class)</mark>
^ `8.1 EnablerID`
<mark style="background: #F77EE1;">(With "Relation," I can have more than 2 records in the same class)</mark>
##### <mark style="background: #068408;">`12.19 RelatedResourceID`: Relation (to ResourceMaterials Class) </mark>
^ `23.1 ResourceID`
(to ResourceMaterials class; ResourceID, to refer to manuals or motion types available, may include multiple records)
##### <mark style="background: #068408;">`12.20 ActivityStatus`: String</mark>
(Values:)
 - `Seeking_Participants`
 - `Registrations_Pending`
 - `Pairing_Confirmed`

##### `12.21 MotionID: Relation (EDIT 241127)

##### <mark style="background: #F77EE1;">`12.18 AllSlotsClaimed`: Boolean</mark> (deleted)
(required, determine whether all Enablers slots have been filled for the registered Activity, the Activity can still go on but would need to find an Enabler before completion to avoid delays in ballot generation, everyone involved in the ActivityID will be able to see whether this boolean is true or false to understand if there's a roadblock and make sure to fill up the remaining slot)

ActivityID 

Participant A01
 - RegID01: ATeamID TF PlayerID
	 - SuperID Approval
Participant A02
 - RegID02: ATeamID M1 PlayerID
	 - SuperID Approval
Participant A03
 - RegID03: ATeamID M2 PlayerID
	 - SuperID Approval
Participant B01
 - RegID04: BTeamID TF PlayerID
	 - SuperID Approval
Participant B02
 - RegID05: BTeamID M1 PlayerID
	 - SuperID Approval
Participant B03
 - RegID06: BTeamID M2 PlayerID
	 - SuperID Approval

EnablerSlots: 3
 - RegID07: EnablerID01
	 - BallotID01: From E01
		 - ATeam Score and Tags (as Feedback)
		 - BTeam Score and Tags

 - RegID08: EnablerID02
	 - BallotID02: From E02
		 - ATeam Score and Tags
		 - BTeam Score and Tags

 - RegID09: EnablerID03
	 - BallotID03: From E03
		 - ATeam Score and Tags
		 - BTeam Score and Tags


#### <mark style="background: #068408;">Do I need a separate field for Analytics and Resources? Can I use the `relatedObjectID` field from Communications Class? (and send them to the corresponding class in Noodl? how do I know which to choose?)</mark>

# 13. BD_Registrations (in)

Stores all Registrations of emDash Activities and the SuperID payment status for all Linked Players participating a given Activity. 

Because this Class points to the callSign, a RegistrationID is created per each userType: PlayerIDs, TeamIDs, EnablerIDs as well as the Linked SuperIDs who approved the payment. 

Payments are verified either via 1) Toss Payments (for non-mpAddOns) or 2) emDash metaPass Button (for those with an outstanding emCoin balance). 

Once a Player or Supervisor registers for an Activity, all involved PlayerIDs must RSVP and the SuperID must make or approve payment before the `13.10 ExpirationDateTime` or the pending ticket will close automatically. 

Upon successful Registration of all involved userTypes and the respective payments verified, those who have RSVP'd will receive a link to enter on D-Day. 

### <mark style="background: #068408;">(EDIT: For a given ActivityID, a RegistrationID is generated for each Player and Enabler. This particular group of RegistrationIDs (all wanting the same Activity) will be required to confirm 1) payment and 2) RSVP for the payment status to become `complete`. If for whatever reason, either parties cannot agree on a date nor pay for the Activity, then that particular group of RegIDs may result in a `Failed` status. Note that the Enablers are not required to pay or RSVP for an Activity. They cast ballots after the round, and will be paid after rendering one. So Enabler slots can remain in their place and when the two participant parties are good to go, then they'll see a 1) confirmed activity with a date or 2) its already done and now waiting for Enablers ballots)</mark>

## 13. Registration Class

##### `13.1 RegistrationID`: objectId  
##### <mark style="background: #068408;">`13.2 UserID`: Pointer</mark>
^c3bcba `1.1 UserID`
(required, to Users class, UserID)
##### <mark style="background: #F77EE1;">13.311 ATeamMateID: Pointer (EDIT: 250409)</mark>
##### <mark style="background: #F77EE1;">13.312 BTeamMateID: Pointer (EDIT: 250409)</mark>
^ `15.1 TeamMateID`
##### <mark style="background: #F77EE1;">`13.32 SoloPlayerID`: Pointer</mark>
^53e59c `2.1 PlayerID`
##### <mark style="background: #F77EE1;">`13.33 EnablerID`: Pointer</mark>
^f48bcc `8.1 EnablerID`
<mark style="background: #F77EE1;">(only one of the three can be populated)</mark>
##### `13.4 ActivityID`: Pointer 
^419349 `12.1 ActivityID`
(required, to Activities class, ActivityID)
##### `13.5 createdAt`: Date
([TBD] conditional, Upon RSVP and payment completion)
##### `13.6 PaymentStatus`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `Pending`
 - `Completed`
 - `Failed`
 - `Expired`
##### `13.7 PaymentAmount`: Number
(conditional, if userType is Player than this number MUST match the Activity Fee)
<mark style="background: #F77EE1;">(Populate this record only when payment has been confirmed) </mark>
##### <mark style="background: #068408;">`13.9 SuperID: Pointer</mark>
^236118 `4.1 SuperID`  
(conditional, SuperID is required if userType is Player) 
##### `13.10 ExpirationDateTime`: Date(&Time) 
<mark style="background: #F77EE1;">(required, ability to offer extensions or force close it via GLOBAL EXTENTSION)</mark>
##### <mark style="background: #068408;">13.111 ATeamID: Pointer (Edit: 250409)</mark> 
##### <mark style="background: #068408;">13.112 BTeamID: Pointer (Edit: 250409)</mark> 
^ `14.1 TeamID`
(conditional, when applicable)
 - ``

##### <mark style="background: #068408;">`13.14 RelatedObjectID`: Object (track RSVP and payments) </mark>
^ca317a `30.1 CommunicationID` 
^99ea6d `29.1 MessageID`
^ `16.1 InvitationID`
^ba7bd3 `11.1 analyticsID`
^ `PaymentID` 
^ `emCoinTransactionID`
(optional, when applicable)

##### `13.15 ActivityDescription`: <mark style="background: #F77EE1;"> String</mark> 
##### `13.16 AvailableDay`: <mark style="background: #F77EE1;"> ARRAY</mark>
##### `13.17 AvailableTime`: <mark style="background: #F77EE1;"> ARRAY</mark>
(added 241219)

##### `13.17 MotionID`: <mark style="background: #F77EE1;"> Pointer</mark>
(added 241228)

=========

##### REMOVED `13.12 Role`: ARRAY <mark style="background: #F77EE1;"> EDIT from: String</mark> 
(Values:)

	[
	"Judge A~C", 
	"A1_FE", 
	"B3_QB",
	]
 
 
 - `SoloPlayer`
 - `Team Founder` (only for Team Activities)
 - `TeamMate`(only for Team Activities)
 - `Adjudicator(Lv.1)`
 - `Instructor(Lv.2)`
 - `Educator(Lv.3)`
 - `Guest_Lecturer` <mark style="background: #F77EE1;">(at least have a userID via one-click login)</mark>
(required, use this to understand what I should show each specific role)


# 14. BE_Teams (in)

Stores all Teams created by emDash Players

considered a userType 

Players can create Teams and become a TeamFounder with the following information: 
 - Team name, logo, and description
 - Select genre: MPED, CREM, EMD DEBATE etc. 
 - Preference on allowing other Players in the Division to send a join request or only inviting Players as the Founder. 
 - Division (automatically)

This means that a Player can create multiple Teams across different genres but also be associated with numerous Teams within one genre (i.e., EMD Debate League). The only barrier is the Division of Players and Teams in that they must all be the same. 

Once a TeamID has been created, the TeamFounder can use this entity to be a spokesperson for the other TeamMates. TeamFounder can only serve during the Division period and the Team will be disbanded when the TeamFounder is assigned to the upper Division. 

As long as the Player is Active in emDash, information about previously associated Teams will be archived (via the History Class) and available for review. 

This includes sending Invitations to other Teams for a quick and easy onboarding process (since the RSVP as well as the SuperID payment process has already been done). 

Also, only TeamFounders can initiate a Message to Enablers and ask for help. Enablers can respond to the Message and address the requested offer.  

All incoming and outgoing Messages and Communications can be viewed by the linked Supervisors. 

## 14. Teams Class
##### `14.1 TeamID`: objectId 
##### `14.2 TeamName`: String
##### `14.3 TeamFounder`: Pointer <mark style="background: #068408;">(to PlayerID)</mark>
^93f53c `2.1 PlayerID`
(required, to Players class; PlayerID)
##### `14.4 GenreID`: <mark style="background: #068408;">Pointer </mark>
^ `33.1 GenreID`
(required, to Genres Class; GenreID)
##### `14.6 TeamDescription`: String
(required,)
##### `14.7 TeamLogo`: <mark style="background: #068408;">Pointer (to FileUpload Class) </mark>
^ `35.1 FileID`
(optional, to FileUpload Class; FileID, Teams MAY have a profile image)
##### `14.8 TeamStatus`: <mark style="background: #F77EE1;"> String</mark>
([Backend Logic] | TeamFounder should be able toggle on and off)
(required, Values:)
 - `TeamMates Wanted`
 - `Full House`
##### <mark style="background: #068408;">`14.9 DivisionID`: Pointer </mark>
^4214c4 `4.1 DivisionID`
(required, to Division Class; DivisionID)
([backend logic] to disband upon Division `9.5 EndingDate`)
##### <mark style="background: #068408;">`14.10 TeamMessages`: Relation</mark>
^1ace34 `29.1 messageID`
(optional, to Message class; MessageID)
##### <mark style="background: #068408;">`14.11 TeamInvites`: Relation</mark>
^ `16.1 InvitationID`
(optional, to Invitations class; InvitationID)
##### <mark style="background: #068408;">`14.12 TeamComm`: Relation</mark>
^ `30.1 CommunicationsID`
(optional, to Communications class; CommunicationID)

##### <mark style="background: #F77EE1;">`14.14 TeamMates`: Relation (to Users) </mark>



##### <mark style="background: #068408;">`14.13 Role`: String (240626 edit)</mark> Don't need since all members have a record on TeamMates Class (240815)
 - `Front-End`
 - `Back-End`
 - `Quarterback`

##### <mark style="background: #068408;">`14.15 AvailabilityID`: Pointer (250204 edit)</mark>
`AP_Availability` Class


# 15. BF_TeamMates (edit)

Stores all TeamMates associated with a Team 

TeamMates can either: 
1) **Ask to Join** a Team; or 
2) **Be Requested to Join** a Team by the TeamFounder 

Both parties must consent to be Associated. 

TeamMates can leave a Team with: 
1) a formal request from TeamFounder (disputes are heard IAW the emDash Organizing Committee Protocol)
2) a formal request from TeamMate (no hearings in such a case)
3) Player moves to a new Division (in which case, Admin will automatically disband the Team)

If the current TeamFounder is expected to move to the upper Division (and subsequently the Team disbanding), the current TeamMates can elect a new TeamFounder to create a new Team and request all the Associates to join. 

All previous Team Associations will be stored in the History Class so Players can be able to keep an archive of which Teams they were associated to and how long was the tenure, (thereby keeping a timestamp of their past contributions to each Team by also linking it with the TeamRankings). 

## 15. TeamMates Class 
##### `15.1 TeamMateID`: objectId 
##### `15.2 TeamID`: Pointer 
^5bf8d4 `14.1 TeamID`
(required, to Teams class; TeamID)
##### `15.3 UserID`: Pointer (from PlayerID)
(to Users class)
##### `15.4 Role`: String (not required)
<mark style="background: #068408;">(required, 3 possible values)</mark>
 - `Front-End`
 - `Back-End`
 - `Quarterback`
##### `15.6 DepartDate`: Date
(conditional, null value until when applicable)
##### <mark style="background: #068408;">`15.7 MateSlot`: String (edit 240626)</mark>
(conditional, null value until when applicable)
 - `TeamFounder`
 - `Mate01`
 - `Mate02`
 - `Mate03`

##### <mark style="background: #068408;">`15.6 RemovalReason`: String (edit 240917)</mark>



# 16. BG_Invitations (in)

InvitationID records may change. 
Stores all Invitations sent and received among PlayerIDs and TeamIDs in the same Division. 
An invitation can be initiated via two ways: 
1) TeamID sends an invitation to another team (Request)
2) PlayerID or TeamID that joined an Activity Chamber and thus created a RegistrationID (pending status) can send and reply to invitations in order to coordinate alternative dates 

Invitations are neat because Teams can automatically load up their TeamMates into the Invitation details and thus complete the [RSVP] requirement from standard Registration. The Linked SuperIDs associated to the participating Teams will be prompted to make/approve payment. 

For Invitations that conflict in terms of Date and Time, emDash will process on *first-come-first-serve* basis. 

Teams must **cordially** send and receive Invitations as this is considered an official proceedings within the emDash playGround involving Registrations and SuperID Tuition 

Enablers are NOT allowed to send invites. 
 - Enablers can receive messages from players in advance and later reply to that message (as a method of inviting players)

## 16. Invitations Class
##### `16.1 InvitationID`: objectId 

##### <mark style="background: #068408;">`16.21 SenderPlayerID`: Pointer</mark>
^65029e `2.1 PlayerID`
##### <mark style="background: #068408;">`16.22 SenderTeamMateID`: Pointer</mark>
^fae78b `15.1 TeamMateID` (TeamFounder only)
(at least one required, to Players or Teams class; PlayerID or TeamID)
##### <mark style="background: #068408;">`16.31 ReceiverPlayerID`: Relation</mark>
^ff1d3c `2.1 PlayerID`
##### <mark style="background: #068408;">`16.32 ReceiverTeamMateID`: Relation</mark>
^abca07 `15.1 TeamMateID` (to TeamMates)
(conditional, to Players or Teams class; PlayerID or TeamID)
<mark style="background: #068408;">(if Sender is TeamFounder, then add own TeamMates as well as the receiverTeamMateIDs)</mark>
##### <mark style="background: #068408;">`16.4 RelatedObjectID`:</mark>  <mark style="background: #F77EE1;"> Object </mark> (optional)
^946557 `12.1 ActivityID`
(for example, to Activities class; ActivityID) 
<mark style="background: #F77EE1;">(EDIT: from ActivityID to relatedObjectID in order to allow other references e.g., using resources to coordinate a match, shouldn't be a requirement since a team/player may just want to iron out the dates first, as a reply to the same thread, users can add the ActivityID later to complete RSVP)</mark>
##### `16.6 InvitationStatus`: <mark style="background: #F77EE1;"> String</mark>
(fetch status from respective users)
(Values:)
 - `Pending`
 - `Accepted`
 - `Declined`
##### `16.7 InvitationContents`: String 
(note to Team)
##### <mark style="background: #F77EE1;"> `16.9 ProposedDateTime`: DateTime</mark>
<mark style="background: #F77EE1;">(EDIT: the only field that must be enforced to justify sending an invitation is the "proposed date and time") </mark>
##### `16.10 AcceptedDateTime`: Date and Time (optional)
<mark style="background: #F77EE1;">(EDIT: accepted date and time is determined by the invitation recipient) </mark>

##### <mark style="background: #068408;">`16.12 DivisionID`: Pointer</mark> 
^3a7f96 `9.1 DivisionID`
(to Division class; DivisionID)
##### <mark style="background: #068408;">`16.13 GenreID`: Pointer</mark> 
^ `33.1 GenreID`
(to Genre Class; GenreID)


### <mark style="background: #068408;">(EDIT: need Division verification from both sender and receiver before sending the invitation to avoid Players from different divisions engaging unless they have established a link.)</mark> 



# 17. BH_Ballots (in)

Stores all Ballots submitted by each Enabler for a given Activity. Multiple Enablers can be assigned to an Activity (e.g., 3 judges per debate round). 

In conjunction with Activity Instance, Ballots serve as the chief cornerstone for all customized feedback and playerAnalytics as the two datasets represent what actually happened during the Activity. 

Each Ballot is submitted by one Enabler and the results, scores and feedback are offered to all Participants (i.e., both Teams information is in one ballot). In the case of three enablers assigned, there will be three BallotIDs for one ActivityID, and the participants (Players or Teams) will be able to view those ballots.  

Participants specified in each ballot will allow the related Players and Teams to view access of the submitted ballot. 

A new BallotID is generated with the Activity and Participant details pre-filled. The results, scores, and feedback will shown as pending until all Ballots are submitted. 

Ballots serve as the justification for all Enabler payments. Whether judging or instructing, each Activity must produce a ballot from each Enabler to serve as services rendered. The contents of the Ballot is how the community evaluates the Enabler's contribution to the system. The quality of the Ballot determines the Enabler's worth and may be sought after. 

##### `17.00 ActivityID`: objectId 
(from RegID)

## 17. Ballots Class

##### ADDED 250403 `17.8 ActivityID`: objectId
##### `17.1 BallotID`: objectId 
##### `17.2 RegistrationID`: Pointer (NEW 241222)
(to BD_Registrations class)
##### `17.3 ReviewerID`: Pointer
^06b191 `8.1 EnablerID`
(to Enabler class; EnablerID)
##### <mark style="background: #068408;">`17.4 EnablerCertID`: Pointer</mark>
^ `10.1 EnablerCertID`
(to EnablerCertifications Class; EnablerCertID; to verify Enabler Level)
##### <mark style="background: #F77EE1;">`17.5 TeamAID`: EDIT Pointer (to Teams Class)</mark>
##### <mark style="background: #F77EE1;">`17.51 TeamBID`: EDIT Pointer (to Teams Class)</mark>
^ `14.1 TeamID`
##### <mark style="background: #F77EE1;">`17.6 ParticipantID`: Relation (to Players Class)</mark>
^ `2.1 PlayerID`
(Do I need this?)

##### `17.7 Result`: <mark style="background: #F77EE1;"> String</mark>
(Values: No Draw) 
 - `PRO Win CON Loss`
 - `PRO Loss CON Win`
 - `Pending`
 (required, )
##### EDIT --> `17.9 ScorecardA1FE`: <mark style="background: #068408;">Pointer</mark>
##### EDIT --> `17.91 ScorecardA2BE`: <mark style="background: #068408;">Pointer</mark>
##### EDIT --> `17.92 ScorecardA3QB`: <mark style="background: #068408;">Pointer</mark>
##### EDIT --> `17.10 ScorecardB1FE`: <mark style="background: #068408;">Pointer</mark>
##### EDIT --> `17.101 ScorecardB2BE`: <mark style="background: #068408;">Pointer</mark>
##### EDIT --> `17.102 ScorecardB3QB`: <mark style="background: #068408;">Pointer</mark>

(241222 newly created Scorecard Class)


##### `17.13 clappedBy`: <mark style="background: #068408;">Relation</mark>
^fd71bc `2.1 PlayerID`
(optional, <mark style="background: #068408;">ONLY</mark> to Players Class; PlayerID, account for multiple Players each giving one clap per ballot)
##### `17.14 ChamberURL`: String <mark style="background: #068408;"></mark>

##### `17.16 updatedAt`: Date (updates on Ballots, Analytics and Claps)
(conditional, )
(updates the last time EnablerID entered the Chamber to render scores and tags. Since Enablers may not complete the entire process in one sitting, Admin will save input values so they can come back and continue)
(also this field will be triggered when receiving a clap from the feedback recipients)
(it is also triggered when this BallotID has interacted with the Analytics, this occurs at the very last step, after the BallotID has been generated, reviewed by the Participants and respective claps were given.)
##### `17.18 includedInAnalytics`: Boolean
(whether the ballot's data has been processed and included in the analytics, aid in effective data management and updating)
##### `17.17 relatedAnalytics`: <mark style="background: #068408;">Relation</mark>
^844e06 `11.1 analyticsID`
(conditional, if BallotID was used in playerAnalytics class; analyticsID, <mark style="background: #068408;">assume possibility of multiple analyticIDs if the Ballot quality is good</mark>)



### Account for the scenarios where the Players are grouped randomly (for not having any associated teams but want to be matched up by the Admin). Ideally, the Admin will recommend Players that match the Activity preferences, but for now Players will have to actively search for and join available Activities. 


##### REPLACED -> `17.2 ActivityID`: Pointer
^5010ab `12.1 ActivityID`
(to Activities class; ActivityID)

##### NEED OWN CLASS -> `17.11 WrittenFeedback`: <mark style="background: #068408;">Object</mark>
(required, to include Tags for each Player with Timestamps from the recorded debate round, we can't force someone to write tags when they have nothing to say, but it will be a good indicator of whether the tags are worthy to both the Players and the Admin.)



# 18. BI_HallOfGame (in)

Stores all Hall Of Game Activities that were invited by the performance in the Player and Team Ranking charts. 
Hall of Game Activities are invitation-only Events and therefore is the most celebrated ranking chart of emDash. 

Hall of Game Activities are announced by emDash and will be listed as a new ActivityID. Those who are eligible will be shown to the respective Players/(Select)s and Supervisors/(Select)s. 


Enabler(Select)s are also eligible to add a Ballot as an addendum to the official ruling via the assigned EnablerIDs. More claps will expediate the level up certification process for that Enabler(Select). 


## HALL OF GAME RANKING CHART 
### 1) Track rankings for all players and teams in the playGround
### 2) Showcase up to specified (72nd) place per each division of each genre 
### 3) Awards offered per competition over 16 participants: 
#### Aggregate 3 Time Top 3: DODECA 12
#### Top 3: ICOSA 20
#### Top 12: OCTA 8
#### Top 28: TETRA 4
#### Top 40: CUBE 6
#### Top 55: SPHERE 1
#### Top 72: PENTA (Pyramid) 5
### 4) The ranking tabulation takes a snap shot of the chart (i.e., is updated) per each lunar month with the 13th 윤달 serving as silent month 
### 5) Each new PlayerRankID record includes Total Events Played, Total Wins, Total Losses, Average Score & Awards accumulated (i.e., SoloEventSpecificRank)
### 6)  In essence, each player will receive a new PlayerRankID every 28 days. It will include the rank changes as well as the history of his/her solo or team events that count toward the ranking position. 


&mdash;



&#151;


 
## 18. HallOfGame Class
##### `18.1 HoGID`: objectId 
##### `18.2 ActivityID`: Pointer 
^fc8b2c `12.1 ActivityID`
(to Activities class; ActivityID)
##### `18.3 EventDate`: Date
##### <mark style="background: #F77EE1;">`18.41 TeamID`: Relation (for team events)</mark>
^ `14.1 TeamID`
(to Teams Class; TeamID)
##### <mark style="background: #F77EE1;">`18.42 SoloPlayerID`: Relation</mark>
^ `2.1 PlayerID`
(to Players Class; PlayerID)
<mark style="background: #F77EE1;">(only one of the two can be populated)</mark>
##### `18.5 DivisionID`: Pointer
^283771 `9.1 DivisionID`
(to Divisions class; DivisionID)
##### <mark style="background: #068408;">18.6 GenreID: Pointer</mark>
^ `33.1 GenreID`
(to Genre Class; GenreID)
##### `18.7 TeamRankings`: <mark style="background: #068408;">Relation </mark>
^e4d0fe `20.1 TeamRankID`
(to display all TeamRankID that entered the HoG Event; TeamRankID)
##### `18.8 PlayerRankings`: <mark style="background: #068408;">Relation </mark>
^5b409e `19.1 PlayerRankID`
(to display all PlayerRankID that entered the HoG Event; PlayerRankID)
##### `18.9 RankingDate`: Date
(new rank date)
##### `18.10 EventName`: String
##### `18.11 EventType`: String 
(only three values, as Exercises cannot generate an HoGID:)
`OPEN_FeatEvent` 
`MEMBERS_SoloEvent` 
`MEMBERS_TeamEvent` 
##### `18.12 EventDescription`: String
(e.g., Tournaments/Exhibitions/Awards/Official Matches)
##### `18.13 EventLocation`: String
##### `18.14 EventStatus`: <mark style="background: #F77EE1;">String </mark> 
(Values:)
 - `Completed`
 - `Ongoing`
 - `Scheduled`
##### `18.15 HistoricalRanking`: JSON/List 
(at the time of the event)






# 19. BJ_PlayerRankings (in)

Stores all Ranked Players in each Division. Only Events are recorded to generate Player and Team ranks. Completing events and exercises may result in Players and Teams earning a Badge and the accumulation of these Badges may lead to receiving an invitation for the upcoming HoG or Scholarship Event.   

## 19. PlayerRankings Class
##### `19.1 PlayerRankID`: objectId  
##### `19.2 PlayerID`: Pointer 
^8e3765 `2.1 PlayerID`
(to Players class; PlayerID)
##### `19.3 DivisionID`: Pointer
^c2d177 `9.1 DivisionID`
(to Divisions class; DivisionID)
##### `19.4 TotalWins`: Number
##### `19.5 TotaLosses`: Number
##### `19.6 LatestScore`: Number
##### `19.7 AverageScore`: Number
##### `19.8 updatedAt`: Date
##### `19.9 RankingPosition`: Number
##### `19.10 TotalEventsPlayed`: <mark style="background: #068408;">Object </mark>
(Genres, NumOfMatches, Details)
##### `19.11 SoloEventSpecificRankings`: <mark style="background: #068408;">Object </mark>
(when applicable, special rankings related to specific events)
(record HoG and/or 16+ participant competitions, these events award more points towards the rankings tabulation = same with 20.11 TeamEventSpecificRankings)
--> player are rewarded with more points toward their rankings by placing in these special events 
##### `19.12 PreviousRank`: Number
(fetched from previous PlayerRankID for respective Team; perhaps PlayerRankID)
##### `19.13 ArchiveDate`: Date
(when the Player leaves the Division)
##### `19.14 TiedRanking`: Boolean 
(for handling tied rankings)
##### <mark style="background: #068408;">`19.16 GenreID`: Pointer</mark>
^ `33.1 GenreID`
(to Genre class; GenreID)

# 20. CA_TeamRankings (in)

Stores all Ranked Teams in each Division

## 20. TeamRankings Class
##### `20.1 TeamRankID`: objectId 
##### `20.2 TeamID`: Pointer 
^b492ac `14.1 TeamID`
(to Teams class; TeamID)
##### `20.3 DivisionID`: Pointer
^5131c5 `9.1 DivisionID`
(to Divisions class; DivisionID)
##### `20.4 TotalWins`: Number
##### `20.5 TotaLosses`: Number
##### `20.6 LatestScore`: Number
##### `20.7 AverageScore`: Number
##### `20.8 updatedAt`: Date
##### `20.9 RankingPosition`: Number
##### `20.10 TotalEventsPlayed`: <mark style="background: #068408;">Object </mark>
(Genres, NumOfMatches, Details)
##### `20.11 TeamEventSpecificRankings`: <mark style="background: #068408;">Object </mark>
(when applicable, special rankings related to specific events)
##### `20.12 PreviousRank`: Number
([Backend Logic] fetched from previous TeamRankID for respective Team; perhaps TeamRankID)
##### `20.13 ArchiveDate`: Date
(when the Player leaves the Division)
##### `20.14 TiedRanking`: Boolean 
##### <mark style="background: #068408;">`20.16 GenreID`: Pointer</mark>
^ `33.1 GenreID`
(to Genre class; GenreID)




# 21. CB_Certifications (in)

Stores all Certifications issued by emDash to be earned as Enablers complete their onboaring process per each Level. 

Lv. 1 Adjudicator (Content Contributer)
Lv. 2 Instructor (Content Performer)
Lv. 3 Educator (Content Creator)


## 21. Certifications Class
##### `21.1 CertID`: objectId
##### `21.2 CertificationName`: String 
##### `21.4 IssuingAuthority`: <mark style="background: #068408;">Relation </mark>
^ `1.1 UserID`
(required, to Users Class; UserID, Non-members i.e., sponsors may issue Certifications)
##### `21.5 CertificationLevel`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `AdjudCert(Lv.I)`
 - `InstruoCert(Lv.II)`
 - `EduceCert(Lv.III)`
 - `Honorary_Lecturer`
(required, )
##### <mark style="background: #068408;">`21.6 CertificationImage`: Pointer (to FileUpload Class)</mark>
^ `35.1 FileID`
(required, to FileUpload Class; FileID)
##### `21.7 CertificationDescription`: String
(required, )
##### <mark style="background: #068408;">`21.8 DivisionID`: Pointer</mark>
^ `9.1 DivisionID`
(optional, assumes the possibility of division-specific requirements as they are divided by age groups)
##### <mark style="background: #068408;">`21.9 GenreID`: Pointer</mark>
^ `33.1 GenreID`
(required, genre-specific requirements)



# 22. CC_Badges (in)

Stores all Badges issued to each Player. Public access Badges are available for Player(Select)s accumulate and thus become eligible for the next Scholarship Activity.  

Members only Badges deal with what can be achieved once the full Dashboard is accessible (e.g., how many matches completed, average score of x or above, won three consecutive matches etc.) 

I. Earned badges for completing a Match-level Activity or Resource: upon completion of each itinerary.  

Three (3) Shields: 
 - Red (Event Activity), 
 - Orange (Exercise Activity), & 
 - Yellow (Resource) 

II. Automatic badges for entering or placing in Competitions and "spark of genius" exerpts: upon meeting milestones and target stats that pertain to the Player's performance such as best speaker nominations, shortest response time to ASYNC rounds, 100 matches, 3 consecutive wins, highest speaker score, most surveyed for best teamwork, best leadership, best supporting role etc.)

Three (3) Shields: 
 - Blue (competition entry), 
 - Indigo (competition placement), & 
 - Purple (HoG invitational entry) 

III. Green badges look at purposeful login (and how a Player treats emDash Admin): upon meeting engagement milestones and target stats that pertain to the Player's presence in the playGround, such as reviewing x resources, offering quality reviews, creating teams and sending invitations. 

 - Green Shield (via various engagement milestones and standards with emphasis on 덕; 심성)

## Badge shields: color + description
### Green badges function as the communication channel with the Admin as it tracks log in/out and engagement levels (e.g., completed x tasks within a month, reviewed how many resources, offered quality reviews with thumbs up, created teams and sent invitations, etc.)
## GREEN: 심성 덕 center purposeful login 
### 068408

### Light badges are awarded as a result of completing an Activity or Resource that may involve competing against an opponent (whether via Solo or Team match). 
## RED: light EV.ActivityID
### B00303
## ORANGE: light ResourceID
### D9853F

## YELLOW: light EX.ActivityID
### CED936

### Dark badges are awarded automatically for entering or placing in a competition with more than 3 teams. They are also automatically awarded when the player/team in question meets a milestone (e.g., 100 matches, 3 consecutive wins, highest speaker score, most surveyed for teamwork etc.) 
## BLUE: dark Competition entry; field
### 475DB3

## INDIGO: dark Competition placement; campaign
### 2522B4
## VIOLET: dark HoG invitational entry; war
### 601592

## BLACK: (hidden) awarded to HoG winners



## 22. Badges Class

##### `22.1 BadgeID`: objectId
##### `22.2 BadgeType`: <mark style="background: #F77EE1;"> String</mark> 
(Values:)
 - `Public_Offering`
 - `Members_Only`
##### `22.3 BadgeName`: String
##### `22.4 BadgeDescription`: String
##### <mark style="background: #068408;">`22.6 BadgeImage`: Pointer (to FileUpload Class)</mark>
^ `35.1 FileID`
(required, to FileUpload Class; FileID)
##### <mark style="background: #F77EE1;"> `22.7 RelatedObjectID`: Object</mark> 
^717dd0 `23.1 ResourceID`
^ `12.1 ActivityID`
(conditional, to ResourceMaterials class; ResourceID)
##### <mark style="background: #068408;">`22.8 DivisionID`: Pointer</mark>
^ `9.1 DivisionID`
(optional, assumes the possibility of division-specific requirements as they are divided by age groups)
##### <mark style="background: #068408;">`22.9 GenreID`: Pointer</mark>
^ `33.1 GenreID`
(required, genre-specific requirements)


# 23. CD_ResourceMaterials (in)

Stores all Resources created or curated by eligible Enablers for the Players to utilize. 

## 23. ResourceMaterials Class
##### `23.1 ResourceID`: objectId
##### `23.2 Title`: String
##### `23.3 Description`: String 
##### `23.4 Content`: String 
##### <mark style="background: #068408;">`23.5 GenreID`: Pointer </mark>
^ `33.1 GenreID`
(Values:)
 - `MPED`
 - `CREM`
 - `EMD_DEBATE`
 - `TOMPED` 
 - `miscellaneous` 
(required, to Genre Class; GenreID)
##### `23.6 PublishedDate`: Date
##### `23.7 AuthorCurator`: Pointer  
^a7460f `8.1 EnablerID`
(to "eligible" Enablers; EnablerID)
##### `23.8 Version`: <mark style="background: #068408;">String </mark> 

##### `23.9 ParentResourceID`: <mark style="background: #068408;">Relation</mark>
^4a9dbf `23.1 ResourceID`
(conditional, may involve multiple records)
##### `23.10 AccessLevel`: <mark style="background: #F77EE1;"> String</mark> 
(Values:) 
 - `Public`
 - `MembersOnly` 
##### `23.11 AverageRating`: <mark style="background: #068408;">Number (rating between 1 ~ 7)</mark>
^c6659c `32.4 Rating`
(To ResourceReview class, updated as users rate the Resource) 
##### `23.12 ReviewCount`: <mark style="background: #068408;">Number</mark> 
^1a970c `32.1 ReviewID`
(Backend Logic to count each ReviewID to get number of views) 
##### `23.13 Hashtags`: <mark style="background: #068408;">String</mark> 
(what the author specifies e.g., #criticalThinking #EMD_Debate_Motion)
(Backend Logic fetch set of Hashtags to be used as specified)
##### `23.14 Attachments`: <mark style="background: #068408;">Relation</mark>
^ `35.1 FileID`
(optional, to FileUpload Class; FileID, may involve multiple downloads)

##### `23.15 MarkedHelpfulBy`:  <mark style="background: #068408;">Relation </mark>
^ `1.1 UserID`

##### `23.16 FlaggedBy`:  <mark style="background: #068408;">Relation</mark>
^ `1.1 UserID`



# 24. CE_Ledger (in) (Toss Payments API)

To capture all USD (KRW) transactions from SuperID as they are the only user who can do so. 

The 27. Payment Class is reserved for payments made to Enablers. 


#### <mark style="background: #068408;">(EDIT: The Ledger and Registrations classes are connected to our Payment Gateway "Toss Payments." Configure payment processes with Noodl, Parse, and Toss Payments API.)</mark>
## 24. Ledger Class 

##### `24.1 TransactionID`: objectId
##### `24.2 SuperID`: Pointer
^674e75 `4.1 SuperID`
(required, to Super class if paid member; SuperID)
##### `24.3 createdAt`: Date
to serve as transaction date
##### <mark style="background: #F77EE1;"> `24.4 RelatedObjectID`: Object </mark>
^b1620d `6.1 mpAddOnID` (Deposit emCoin amount in record)
^b8e07c `13.1 RegistrationID` (Deposit exact emCoin amount that matches tuition)
^6fda59 `5.1 SubscriptionID` (No need to deposit emCoins)
(SubscriptionID, mpAddOnID or RegistrationID)
##### `24.5 Amount`: Number
##### `24.6 PaymentMethod`: String
> (either bank wire transfer or Korean PG)
##### `24.7 PaymentStatus`: String
##### `24.8 applicantEmail`: String

##### `24.9 transactionRemarks`: String



# 25. CF_paymentInfo (in)

Stores all payment methods and details when remitting compensation to each EnablerID

## 25. paymentInfo Class
##### `25.1 paymentInfoID`: objectId 
##### `25.2 EnablerID`: Pointer
^80e920 `8.1 EnablerID`
(to Enabler class; EnablerID)
##### `25.3 paymentMethod`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `Bank`
 - `PayPal`
 - `Other`
##### `25.4 paymentDetail`: <mark style="background: #068408;">Object</mark> 
(encrypted field)
##### `25.5 paymentCycle`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `Quarterly` 
 - `Monthly`

# 26. CG_ScholarshipRecipients (in)

Stores all Scholarship awarded to Recipients with pending, claimed or declined statuses.  

## 26. ScholarshipRecipient Class
##### `26.1 RecipientID`: objectId 
(emDash must confirm SuperID for all Scholarshipship Recipients)
##### `26.2 ScholarshipID`: Pointer 
^27d73d `7.1 ScholarshipID`
(to ScholarshipPool class; ScholarshipID)
##### `26.3 PlayerID`: Pointer 
^514ada `2.1 PlayerID`
##### `26.4 Amount`: Number
(in emCoins)
##### `26.5 AwardDate`: Date
(conditional, specify date if status is Claimed)
##### `26.6 Status`: <mark style="background: #068408;">String</mark>
(Values:)
 - `Claimed` 
 - `Pending` 
 - `Declined`
##### `26.7 Remarks`: String
(optional)


# 27. CH_Payments (in)

To capture all Payments remitted to Enablers for rendering their respective services or products 
To store all compensations via USD(KRW) remitted to Enablers.  

Payments are only made for submitting Ballots per each Activity. Since Ballots can be traced back to their respective RegistrationIDs and ActivityIDs, they serve as list of services rendered by each Enabler.   

## 27. Payments Class
##### `27.1 PaymentID`: objectId 
##### `27.2 EnablerID`: Pointer 
^472f3f `8.1 EnablerID`
(to Enablers class; EnablerID)
##### `27.3 PaymentDate`: Date
(required, createdAt date MAY be different from PaymentDate)
##### `27.4 Description`: String
##### `27.5 Amount`: Number
##### <mark style="background: #068408;">`27.6 paymentInfoID`: Pointer </mark>
^dd4812 `25.1 paymentInfoID`
(to paymentInfo Class, `25.3 paymentMethod` of paymentInfoID)
##### `27.7 PaymentStatus`: String
##### `27.9 RenderedBallotID`: <mark style="background: #068408;">Relation</mark> 
^476e6d `17.1 BallotID`
(to Ballots class; BallotID)


# 28. CI_callSignLog (in)

Stores all changes to the callSign which acts as a username in emDash. 

## 28. callSignLog Class
##### `28.1 logID`: objectId 
##### `28.2 UserID`: Pointer
^566c4d `1.1 UserID`
(to Users class, UserID)
##### `28.3 previousCallSign`: String 
(The old callSign before the change)
##### `28.4 newCallSign`: String 
(The updated callSign)
([Backend Logic] "Sure you want to change?" [Popup] appears)
##### `28.5 changeDate`: Date
##### `28.6 changeApproved`: Boolean 
([Backend Logic] Admin to confirm the change to verify no overlaps; "callSign already exists, please try another" or "callSign change approved")
<mark style="background: #068408;">(EDIT: the intent here is to make sure the new callSign has been vetted by the Admin, even if it was done immediately. Do I need this?)</mark>
##### `28.7 reasonForChange`: String

# 29. CJ_messages (edit)

automatically expires (i.e., on the 15th day) and deleted unless the message is active or has been archieved within 14 days. 

> Can't I use the userTypeID to automate the `29.8 messageType`: Enum value?

A series of messageIDs that make up a thread will be stored under one item. 

Stores all Messages sent and received among various userTypes. UserID does not send or receive Messages directly but via their respective userTypes. UserIDs without a PlayerID or SuperID can not send or receive messages. Only onboarded members have access to messages within the defined protocol. 

The core logic: all linked users can communicate with each other. Players can create new links via joining Teams and engaging in Activities. Approaching other Players in emDash with respect is of the utmost importance. 

Therefore, clearly established **LINKs** such as Supervisors, TeamFounders and TeamMates eliminate anonymity. Associates should feel free to send and receive messages.

Other interactions such as completing an Exercise or competing in an Event **together** can be used as a reference to **ASK** whether to join a Team, invite one to an Activity or request services to an Enabler for a joint session. 

To recap: 

*If you don't know 'em, you can't just hit 'em up. 
It must be done with courtesy and a clear reference point of mutual interest.
Otherwise, you're just wasting people's time. Think harder and work smarter.*


| Messages | PlayerID   | SuperID    | Founder        | Mate     | Enabler    |     |
| -------- | ---------- | ---------- | -------------- | -------- | ---------- | --- |
| PlayerID | **LINK**   | **LINK**   | <u>ASK</u>     | **LINK** | x          |     |
| SuperID  | **LINK**   | <u>ASK</u> | **LINK**       | **LINK** | <u>ASK</u> |     |
| Founder  | <u>ASK</u> | **LINK**   | <u>ASK</u>     | **LINK** | <u>ASK</u> |     |
| Mate     | **LINK**   | **LINK**   | **LINK**       | **LINK** | x          |     |
| Enabler  | x          | <u>ASK</u> | <u>RESPOND</u> | x        | <u>ASK</u> |     |

For enablers to reach out to Players (e.g., invite them to a created chamber), they must send an ASK message to Supervisors. The assigned SuperID will determine whether to go ahead with the request. 


## 29. messages Class

##### `29.1 messageID`: objectId
##### <mark style="background: #068408;">`29.21 senderPlayerID`: Pointer</mark>
^8d1e69 `2.1 PlayerID`
##### <mark style="background: #068408;">`29.22 senderSuperID`: Pointer</mark>
^74ec25 `4.1 SuperID`
##### <mark style="background: #068408;">`29.23 senderEnablerID`: Pointer</mark>
^85df57 `8.1 EnablerID` (respond only)
##### <mark style="background: #068408;">`29.24 senderTeamMateID`: Pointer</mark>
^0edff8 `15.1 TeamMateID` (by TeamFounder)
(at least one required; set up conditions and triggers preventing Enablers from initiating messages unless one was received from a TeamFounder)
##### <mark style="background: #068408;">`29.25 senderUserID`: Pointer</mark>
`1.1 UserID`

##### <mark style="background: #068408;">`29.31 receiverPlayerID`: </mark><mark style="background: #F77EE1;"> Pointer (edit 250210)</mark>
^708dfe `2.1 PlayerID`
##### <mark style="background: #068408;">`29.32 receiverSuperID`: Pointer</mark>
^accac3 `4.1 SuperID`
(Players are only allowed to contact their linked Supervisor and other Supervisors are not searchable)
##### <mark style="background: #068408;">`29.33 receiverEnablerID`: </mark><mark style="background: #F77EE1;"> Pointer (edit 250210)</mark>
^68400d `8.1 EnablerID` (respond only)
##### <mark style="background: #068408;">`29.34 receiverTeamMateID`: Relation</mark>
^9cb82d `15.1 TeamMateID` (by TeamFounder)
(at least one required; accepts multiple receivers, ensure that all TeamMates and the Linked Supervisor also receive the message sent to Enablers)
##### <mark style="background: #068408;">`29.35 receiverUserID`: Pointer</mark>
`1.1 UserID`
##### `29.4 messageContent`: String

##### `29.7 relatedObjectID`: <mark style="background: #F77EE1;"> Object</mark> (optional)
^53e214 `12.1 ActivityID`
^ `23.1 ResourceID` `22.1 BagdeID` etc. 
(optional when applicable; to serve as a justification for association among players, teams and enablers)
##### `29.8 messageType`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
- `LINKED_PlayerToSupervisor`
- `LINKED_SupervisorToPlayer`
- `LINKED_PlayerToPlayer`
- <mark style="background: #F77EE1;"> ASKING_PlayerToPlayer (edit 250210)</mark>
- `ASKING_PlayerToTeamFounder` (to join)
- `ASKING_TeamFounderToPlayer` (to join)
- `LINKED_TeamMateToTeamFounder`
- `LINKED_TeamFounderToTeamMate`
- `ASKING_TeamToEnabler`
- `ASKING_PlayerToEnabler` (only upon prior consent and with a reference ActivityID to justify the association)
	- Also note that with this logic, players should be able to reach out to other players if an association is established (via shared ActivityID)
- `RESPONDING_EnablerToTeam` (only as a response)
- `ASKING_EnablerToEnabler` 
- `ASKING_EnablerToSuper`(justification: PlayerID/SuperID who are on the clap list)
- `ASKING_SuperToSuper`(justification: supervisors are expected to build relationships also) 
- `ASKING_SuperToEnabler`(justification: supervisors will have enablers that they want to build relationships with) 

(display the correct combination depending on the userType, e.g., not to be confused with Player vs. Team scenarios)
##### <mark style="background: #068408;">`29.9 attachment`: Pointer (to FileUpload Class)</mark> 
^ `35.1 FileID`
(optional, to FileUpload Class; FileID, user MAY attach files up to 30MB)
##### `29.10 replyToMessageID`: Pointer
^ `29.1 messageID`
(conditional, messageID)
##### `29.11 status`: <mark style="background: #F77EE1;"> String</mark> 
(overall lifecycle status of messages)
(Values:)
 - Sent 
 - Read
 - Replied
 - RepliedTo

 - `Active`
 - `Archived`
 - `Deleted`

##### `29.12 StartThreadID`: <mark style="background: #F77EE1;"> pointer</mark> 
to the first messageID that started the thread

##### `29.13 ThreadCount`: <mark style="background: #F77EE1;"> pointer</mark>


##### <mark style="background: #068408;">`29.13 isDelivered`: Boolean (수신 확인)</mark>
(whether the message has been delivered successfully)

##### <mark style="background: #E633C5;">`29.12 ConversationID`: pointer (edit 240627)</mark>


##### <mark style="background: #E633C5;">`29.14 ReadBy`: Array (edit 240627)</mark>


##### <mark style="background: #F77EE1;">`29.6 ReadBy`:</mark> <mark style="background: #068408;"> Date </mark> deleted

# 30. DA_Communications (in)

Stores all Communications issued by emDash for the four userTypes. 

Notification
 - Sent to individual users and associated groups (e.g., LinkedPlayers, TeamMates)
 - Specifies the receiver 

Announcement
 - Sent to all Players-Supervisors assigned to a Division
 - Sent to all Enablers 
 - Sent to all Supervisors
 - Sent to all Players
 - Sent to all Teams 

Popup
 - requires user input

Toasts 
 - quick notice


## 30. Communications Class
##### `30.1 CommunicationID`: objectId 
##### `30.2 CommunicationType`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `Notification`
 - `Announcement`
##### `30.3 Title`: String
##### `30.4 Content`: String
##### `30.5 PostedBy`: Pointer (to Users Class)
^ `1.1 UserID` 
(always Admin UserID, via system-generated messages)
##### <mark style="background: #068408;">`30.6 GenreID`: Pointer (optional)</mark>
^ `33.1 GenreID`
(optional, )
##### <mark style="background: #068408;">`30.7 UserID`: Pointer (240626 edit)</mark>

##### <mark style="background: #068408;">`30.8 TargetDivision`: Pointer (optional)</mark> 
^76c692 `9.1 DivisionID`
(to Divisions class; DivisionID)
##### <mark style="background: #F77EE1;">`30.11 ReadBy`: Array (240626 edit)</mark> 


##### `30.12 ExpiryDate`: Date (optional)
##### <mark style="background: #F77EE1;"> `30.13 RelatedObjectID`: Object </mark>
^9badef `30.1 CommunicationID`
^61192a `31.1 emCoinTransactionID`
^0892ee `1.1 UserID`
^be4ae1 `17.1 BallotID`
^de50dc `19.1 PlayerRankID`
^ce0852 `20.1 TeamRankID`
^6aa540 `21.1 CertID`
^2a5f49 `3.1 PlayerBadgeID`
^7bc165 `10.1 EnablerCertID`
^ec3f6a `22.1 BadgeID`
^9c023a `26.1 RecipientID`
^77afb4 `30.1 ResourceID`
^38fd4f `13.1 RegistrationID`
^af55f5 `18.1 HoGID`
^d326d1 `27.1 PaymentID`
^e4d4af `30.1 CommunicationID`
^980184 `12.1 ActivityID`
^ `35.1 FileID`
(optional: other related classes; analyticsID, ActivityID, RegistrationID, CommunicationID, PaymentID, HoGID, ResourceID, BadgeID, CertID, PlayerBadgeID, EnablerCertID,  etc.)


deleted

##### <mark style="background: #068408;">`30.71 PlayerID`: Relation</mark>
^5a86d9 `2.1 PlayerID`
(at least one required, to Players Class)
##### <mark style="background: #068408;">`30.72 SuperID`: Relation </mark>
	^339529 `4.1 SuperID`
(optional, to Supervisors Class)
##### <mark style="background: #068408;">`30.73 EnablerID`: Relation </mark>
^034827 `8.1 EnablerID`
(optional, to Enablers Class)
##### <mark style="background: #068408;">`30.74 TeamMateID`: Relation </mark>
^0ce9e1 `15.1 TeamMateID`
(optional, to Teammates Class)

# 31. DB_emCoinTransactions (in)

emCoins are used only within the emDash Ecosystem and provide a more seamless experience to the Supervisor when making payments for Activities in the playGround. SuperIDs with a mpAddOn will be able to make quick payments by clicking "Approve"  on their Dashboard when the Notification appears. This simplifies the process since the alternative requires SuperIDs to complete payment via Toss Payments API. 

Moreover, emCoins are used so that emDash can show gratitude to the prepaid Supervisors for their generosity and commitment by offering more value while seeking permission to enforce a quota where unused emCoins can be used to offer Scholarships to other Players and Player(Select)s, thereby recognizing and celebrating competence and compassion. This creates a positive loop where bright and dedicated Players from all around the world are encouraged to join and a self-sustaining Scholarship Pool allows them to engage with other Players on the Ground. 


Stores all emCoin transactions and exclude all USD(KRW) transactions.  

1 emCoin = 1 USD when bought and used immediately. 
1 emCoin < 1 USD if prepaid via mpAddOnID (161.8% of deposited USD)

100만원: 5만원 = 162만원: 8.1만원
100만원: 4만원 = 162만원: 6.48만원

60 emCoins

63 67 68 72 75 79 

1000 USD to 50 USD 
1618 emCoins to 72 emCoins

Upon confirmation from Toss Payments API verifying the corresponding USD(KRW) amount, a new `31.1 emCoinTransactionID` is generated in this Class.  

Also `31.7 UserStatus` is related to metaPassAddons Class and by association, is related to the Registrations Class and ScholarshipPool Class accordingly. With the former, Supervisors can easily approve payments from their outstanding emCoin balance whereas the latter involves making individual payments in USD(KRW) so they are converted into emCoins, and again for that same amount to be deposited and withdrawn (addition and subtraction) from the Supervisor's emCoin Balance. 


## 31. emCoinTransactions Class

##### `31.1 emCoinTransactionID`: objectId
(backend logic to be generated upon confirmation from both emDash and Toss Payments API)
##### `31.2 SuperID`: Pointer
^eb76f9 `4.1 SuperID`
(to Supervisor class; SuperID)  
##### `31.3 CreDebitType`: <mark style="background: #F77EE1;"> String</mark> 
(Values:)
 - `Addition` 
 - `Subtraction`
##### `31.4 Amount`: Number
##### `31.5 BalanceTrigger`: <mark style="background: #F77EE1;"> Object</mark> 
^0c0334 `26.1 RecipientID` (TBD; Add and subtract emCoins for the ActivityID)
^1419b1 @`13.1 RegistrationID` (Add and subtract emCoins matching the paid amount)
^e27654 `6.1 mpAddOnID` (Assuming sufficient balance, subtract emCoins only)
(to ScholarshipRecipient, Registration or metaPassAddOns class; RecipientID, RegistrationID or mpAddOnID)
##### <mark style="background: #068408;">`31.7 mpAddOnID`: Pointer</mark>
^ `6.1 mpAddOnID`
(conditional, to metaPassAddOns Class; mpAddOnID)
##### <mark style="background: #068408;">`31.8 relatedemCoinTransactions`: Relation</mark>
^66cdce `31.1 emCoinTransactionID`
(conditional, if payment has been confirmed, to emCoinTransactions Class; emCoinTransactionID)


# 32. DC_ResourceReviews (in)

Stores all reviews for a Resource. 
One record represents a review created by one user. 
non-paid members cannot write reviews. 

## 32. ResourceReview Class
##### `32.1 ReviewID`: objectId 
##### `32.2 ResourceID`: Pointer 
^f53f58 `23.1 ResourceID`
(to associated resource; ResourceID)
##### <mark style="background: #068408;">`32.3 ReviewerID`: Pointer</mark>
^ `1.1 UserID`
(required, to Users Class; UserID)
##### `32.4 Rating`: <mark style="background: #F77EE1;"> Number</mark>

##### `32.5 Comment`: String

##### `32.7 Visibility`: <mark style="background: #F77EE1;"> String</mark>
(Values:)
 - `Linked_Members`
 - `All_Members`
##### `32.8 MarkedHelpful`:  <mark style="background: #068408;">Boolean </mark>
##### `32.9 Flagged`:  <mark style="background: #068408;">Boolean </mark>

##### `32.10 FlagReason`: <mark style="background: #068408;">String </mark> 
(The reviewer MUST write a reason justifying the flag.)
##### `32.11 ActivityID`: Pointer 
^af442e `12.1 ActivityID`
(If the resource is from an Activity)
##### `32.12 BadgeID`: Pointer
^0364d2 `22.1 BadgeID` 
(If the resource is from an Badge)
##### `32.13 ThumbsUp`: <mark style="background: #068408;">Relation (to Users Class</mark>
^ `1.1 UserID`
##### `32.14 ThumbsDown`: <mark style="background: #068408;">Relation (to Users Class)</mark>
^ `1.1 UserID`
(list of who voted Thumbs up or down; to Users Class)

# 33. DD_Genres (in)
Stores all Genres in the emDash playGround 

Specifies which Division the Genre belongs to. It's possible to foresee a situation where only older divisions are allowed to enter. It's also possible to expect new divisions to emerge, e.g., Grade 3 - Prep Division.

(to be updated as more genres are added)
(Values:) 
 - `MPED`
 - `CREM`
 - `EMD_DEBATE`
 - `TOMPED` 

##### `33.1 GenreID`: objectID
##### <mark style="background: #068408;">`33.2 GenreName`: String</mark>
(required,)
##### <mark style="background: #068408;">`33.3 DivisionID`: Relation</mark>
^ `9.1 DivisionID`
(to Divisions Class; DivisionID)
##### <mark style="background: #068408;">`33.4 GenreDescription`: String</mark>
(required,)
##### <mark style="background: #F77EE1;">`33.5 Organizers`: Relation (to Users Class)</mark>
(at least one,)
##### <mark style="background: #F77EE1;">`33.6 Sponsors`: Relation (to Users Class)</mark>
(conditional, )
##### <mark style="background: #F77EE1;">`33.7 Collaborators`: Relation (to Users Class)</mark>
(conditional, )
##### <mark style="background: #068408;">`33.8 ApprovalDate`: Date</mark>
(required,)



# 34. DE_PlayerPersonality (in)

Stores all Personality scores of Players who agreed to making it open to other members via PlayerID Profile in the Directory. 

##### `34.1 CharacterID`: objectID
##### <mark style="background: #F77EE1;">`34.2 MBTI`: Object</mark>
<mark style="background: #F77EE1;">(required, string text in Noodl will be formatted to be an Object/JSON)</mark>
##### <mark style="background: #F77EE1;">`34.3 OCEAN`: Object</mark> 
(required, numbers only )
##### <mark style="background: #068408;">`34.4 PlayerID`: Pointer</mark>
^ `2.1 PlayerID`
(required, to Players Class; PlayerID)
TBD should Enablers get this?  
##### <mark style="background: #068408;">`34.5 Visibility`: String</mark>
(required, Values:)
- `None`
- `Only Team Mates
- `All playGround Members
##### <mark style="background: #068408;">`34.6 ExpirationDate`: Date</mark>
(required, set to end of Division duration)

# 35. DF_FileUpload (in)
Stores all file uploaded by all usertypes. Records MUST specify HexName in order to properly delete source file from system. Otherwise, only the link is deleted and the original file will continue to eat up storage.  

<mark style="background: #F77EE1;">(Note: files are accessible via url)</mark>

##### `35.1 FileID`: objectID 
##### <mark style="background: #068408;">`35.2 Uploader`: Pointer</mark>
^ `1.1 UserID`
(to Users Class; UserID)
##### <mark style="background: #068408;">`35.3 TargetObjectID`: Object</mark>
^ `1.6 ProfileImage`
^ `14.7 TeamLogo
^ `22.6 BadgeImage
^ `21.6 CertificateImage
^ `23.14 Attachments` ResourceMaterial Class
^ `4.9 enrollmentCert` 
^ `29.9 attachment`
(required, )
##### <mark style="background: #068408;">`35.4 FileName`: String </mark>
(required, )
##### <mark style="background: #068408;">`35.5 FileDescription`: string </mark>
(required, )
##### <mark style="background: #068408;">`35.6 SourceFile`: File</mark>
(required, )
##### <mark style="background: #068408;">`35.7 HexName`: String </mark>
(required, )
##### <mark style="background: #068408;">`35.8 Size`: number</mark>
(required, )




# 36. DG_InstanceChamber(in)

Stores all Instance Chambers. 

(1) RSVP'd & (2) Paid ActivityID with RegistrationIDs of all participants (and later Enablers) will be given a Chamber URL to join the Activity. 

##### `36.1 InstanceID`: objectId
##### <mark style="background: #068408;">`36.2 ActivityID`: Pointer</mark>
^ `12.1 ActivityID`
(required, )
##### <mark style="background: #068408;">`36.3 RSVPDateTime`: Relation</mark>
^ `13.1 RegistrationID`
(required, from Registrations Class; 13.5 RegistrationDate)
##### <mark style="background: #068408;">`36.4 RollCall`: Relation</mark>
^ `1.1 UserID`
(required, to User Class; UserIDs, to check who signed into the Instance Chamber)
##### <mark style="background: #068408;">`36.5 ChamberURL`: URL</mark>
(required, )
##### <mark style="background: #F77EE1;">36.6 IssueReport:</mark> <mark style="background: #068408;">Object</mark>
##### <mark style="background: #F77EE1;">36.71 LiveRecordingURL:</mark> <mark style="background: #068408;">String</mark>
##### <mark style="background: #F77EE1;">36.72 FileUploads:</mark> <mark style="background: #068408;">Relation (to FileUpload Class)</mark>
^ `35.1 FileID`
##### <mark style="background: #F77EE1;">36.8 EnablerBallotGen: </mark> <mark style="background: #068408;">Relation (to Ballots Class)</mark>
^ `17.1 BallotID`
(Grab all ballots generated by registered Enablers)
##### <mark style="background: #068408;">`36.9 DecisionRendered`: Boolean</mark>


# 37. AK_Invitations (in)

Stores all invitations sent to potential supervisors triggered by a player's onboarding process. Each player must assign a supervisor and if the supervisor in question is not registered into the playGround, she must complete the onboarding as well. 

##### `37.1 newUserInviteID`: objectId
##### <mark style="background: #F77EE1;">`37.2 invitingUserId`: Pointer (Added by Richard)</mark>
(to `_User` class)
##### <mark style="background: #F77EE1;">`37.3 receivingUserId`: Pointer (Added by Richard)</mark>
(to `_User` class)

##### <mark style="background: #F77EE1;">`37.4 invitationStatus`: String (Added by Richard)</mark>
 - `Pending`
 - `Declined`
 - `Accepted`

##### <mark style="background: #F77EE1;">`37.4 enrollmentCert`: Pointer (Added by Richard)</mark>
(to `DF_FileUpload` class)

##### <mark style="background: #F77EE1;">`37.5 PlayerID`: Pointer (Added 240704)</mark>
##### <mark style="background: #F77EE1;">`37.6 SuperID`: Pointer (Added 240704)</mark>
##### <mark style="background: #F77EE1;">`37.7 EnablerID`: Pointer (Added 240704)</mark>
(in case Admin wants to invite Enablers)

# 38. AL_Conversation class

##### `38.1 ConversationID`: objectId

##### `38.2 expiryDate`: Date (optional) <mark style="background: #E633C5;">- don't delete but archive </mark>

initiator: pointer to user class

participants: relation to user class 

invitation: pointer to invitation class

##### <mark style="background: #068408;">`38.2 ActivityID`: Pointer</mark>
^ `12.1 ActivityID`
(required, )


# 39. AM_Scorecard (in)

##### ADDED 250403 `39.22 ActivityID`: objectId
##### `39.1 ScorecardID`: objectId

##### `38.2 RegistrationID`: Pointer
##### `38.3 TeamID`: Pointer
##### `38.4 UserID`: Pointer
##### `38.5 Role`: String
 - A1_FE / A2_BE / A3_QB / B1_FE / B2_BE / B3_QB
##### `38.6 R01`: number
##### `38.7 R02`: number
##### `38.8 R03`: number
##### `38.9 R04`: number
##### `38.10 R05`: number
##### `38.11 R06`: number
##### `38.12 A07`: number
##### `38.13 A08`: number
##### `38.14 A09`: number
##### `38.15 A10`: number
##### `38.16 S11`: number
##### `38.17 S12`: number
##### `38.18 S13`: number
##### `38.19 S14`: number
##### `38.20 BallotID`: Pointer
##### `39.21 FeedbackID`: Pointer

<mark style="background: #E633C5;">- don't delete but archive </mark>


initiator: pointer to user class

participants: relation to user class 

invitation: pointer to invitation class

##### <mark style="background: #068408;">`38.2 ActivityID`: Pointer</mark>
^ `12.1 ActivityID`
(required, )


# 40-1. AN_Feedback (in)

##### `40.1 FeedbackID`: objectId

##### `40.2 ActivityID`: Pointer
##### `40.3 BallotID`: Pointer
##### `40.4 EnablerID`: Pointer
##### `40.5 Role`: String
 - `A1_FE / A2_BE / A3_QB / B1_FE / B2_BE / B3_QB`
##### `40.6 ScorecardID`: Pointer
##### `40.7 ScoreCategory`: Array
 - `["R01", "R02", ... "S13", "S14]`
##### `40.8 Feedback`: String
##### `40.9 Timestamp`: String

# 40-2. History

"History" class captures before and after states of a given class, primarily for those that involve various status states such as pending, complete, thereby allowing the emDash Admin to capture each moment of a series of statuses for a given objectId.  

emDash Admin will either manually change the status (e.g., upon verifying requested documentation) or automate the change upon meeting the requirement to move to the next series of completing the lifecycle for that objectId.  

Starting from the Registration phase, an Audit Trail of Classes is defined with a clear track history mechanism. Therefore the History Class will limit the archiving of such Classes except for critical junctures. Before and after the Activity Instance is a good rule of thumb. 

Registrations, Ballots, Invitations, ResourceMaterials, Player and Teams Rankings as well as Hall Of Game Rankings. Selected Messages and Communications also fit this scenario as they may have deadlines or pending statuses. 

## History Class
##### `33.1 HistoryID`: objectId 
##### `33.2 RelatedClass`: String 
(to e.g., Registration, Invitation class) 
##### `33.3 RelatedID`: Pointer
^2560cd `26.1 RecipientID`
^3d412b `11.1 analyticsID`
^bf57d6 `12.1 ActivityID`
^d12fd7 `6.1 mpAddOnID`
^f80e06 `1.1 UserID`
^9bfc31 `4.1 SuperID`
^c5c018  `2.1 PlayerID`
^17748d `15.1 TeamMateID`
^76167d `14.1 TeamID`
^35538a `5.1 SubscriptionID`
^6c5c87 `8.1 EnablerID`
^2f6607 `30.1 CommunicationID`
^9d6541 `29.1 messageID`
^4b5628 `23.1 ResourceID`
^d8cc90 `20.1 TeamRankID`
^814457 `19.1 PlayerRankID`
^45f37d `18.1 HoGID`
^d15765 `17.1 BallotID`
^c037f0 `16.1 InvitationID`
^89cf71 `13.1 RegistrationID`
(to related IDs e.g., RegistrationID, InvitationID, BallotID, ResourceID, PlayerRankID, TeamRankID, HoGID, selected messageID and CommunicationID)
##### `33.4 ChangeDate`: Date
##### `33.5 ChangedBy`: Pointer 
([Backend Logic] | [emDash Admin]  [[00. emDash playGround]] changes will be approved manually by a Human or via system-generation/automation) 
##### `33.6 PreviousState`: String/JSON 
(capture before state)
##### `33.7 CurrentState`: String/JSON 
(capture after state)
##### `33.8 ChangeType`: Enum 
(Values:)
 - `Creation`
 - `Update`
 - `Deletion`
##### `33.9 Remarks`: String


### <u>Class Relations:</u>

`33.1 HistoryID` pointers:


`33.3 RelatedID` Pointers: 

[[05. AF_Subscriptions (in)]] `5.1 SubscriptionID`
To archive `5.4+5.5 Start+EndDate` &  `5.7 ActiveStatus` of Subscriptions
[[11. BB_playerAnalytics (in) (deliberate JSON config)]] @`11.1 analyticsID`
To archive changes made to playerAnalytics
[[13. BD_Registrations (in)]] @`13.1 RegistrationID`
To archive changes made to Registration status 
[[16. BG_Invitations (in)]] @`16.1 InvitationID`
To archive changes made to Invitation status
[[17. BH_Ballots (in)]] @`17.1 BallotID`
To archive changes made to Ballot status 
[[23. CD_ResourceMaterials (in)]] @`23.1 ResourceID`
To archive changes made to each Resource 
[[19. BJ_PlayerRankings (in)]] @`19.1 PlayerRankID`
[[20. CA_TeamRankings (in)]] @`20.1 TeamRankID`
[[18. BI_HallOfGame (in)]] @`18.1 HoGID`
To archive changes made to the ranking charts 

[[14. BE_Teams (in)]] @`14.1 TeamID`
[[15. BF_TeamMates (edit)]] @`15.1 TeamMateID`
To archive Team's disband status and track previous Team and TeamMate Associations



[[02. AC_Players (in)]] @`2.1 PlayerID`
[[04. AE_Supervisors (in)]] @`4.1 SuperID`
To archive Links and Asks, as well as other insights to enhance user experience

[[08. AI_Enablers (in)]] @`8.1 EnablerID`
To check Certification status of each Enabler(Select) during the onboarding process 


### <u>Description:</u>  (History Stories)

&mdash;

<u>Description:</u> 

Creates

Receives
Sends

Assigns
Edits


<u>INPUT:</u>

[ofHuman] 



[ofMachine]


<u>OUTPUT:</u>

[withHuman]


[withMachine]

&#151;


<u>Class Relations:</u>

Receives as INPUT
Generates as OUTPUT

# 41. AO_Motions (in)

&mdash;


&#151;

##### `41.1 MotionID`: objectId
##### `41.2 MotionNumber`: String
##### `41.3 Resolution`: String
##### `41.4 AdminUserID`: Pointer
##### `41.5 Genre`: Pointer
##### `41.6 Remarks`: String
 - Qualifiers, definitions etc. 


# 42. AP_Availability (in)

&mdash;


&#151;

##### `42.1 AvailID`: objectId
##### `42.2 TeamID`: Pointer
(`BE_Teams Class`)
##### `42.3 MotionList`: Array
##### `42.4 UserID`: Pointer
(`_User class`)
##### `42.5 SpecifiedDateSlots`: Array
##### `42.6 SunSlots`: Array
##### `42.7 MonSlots`: Array
##### `42.8 TueSlots`: Array
##### `42.9 WedSlots`: Array
##### `42.10 ThuSlots`: Array
##### `42.11 FriSlots`: Array
##### `42.12 SatSlots`: Array


##### `42.13 TeamName`: String (added 250205)
##### `42.14 DivisionID`: Pointer (added 250205)

<mark style="background: #E633C5;">- don't delete but archive </mark>
