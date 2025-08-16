# DATABASE SCHEMA

**erDiagram**

    Users **{**
        string UserID PK
        string callSign
        string password
        string email
        string profileImage
        boolean financialAidEligibility
        date lastLoginDate
        string PlayerID FK
        string SuperID FK
        string EnablerID FK
    **}**

    AC_Players **{**
        string PlayerID PK
        string firstName
        string lastName
        date dateOfBirth
        string school
        string location
        int gradYear
    **}**

    AD_PlayerBadges **{**
        string PlayerBadgeID PK
        string PlayerID FK
        string BadgeID FK
        string earnedFor
        date earnedDate
    **}**

    AE_Supervisors **{**
        string SuperID PK
        string firstName
        string lastName
        string contactNumber
        relation LinkedPlayers
        string SubscriptionID FK
        string lastBalance FK
        relation enrollmentCert
    **}**

    AF_Subscriptions **{**
        string SubscriptionID PK
        string SuperID FK
        string planType
        date endDate
        float totalAmount
        boolean activeStatus
    **}**

    AG_metaPassAddOns **{**
        string mpAddOnID PK
        string SuperID FK
        relation LinkedPlayerID
        string SubscriptionID FK
        float amountPrepaid
        float emCoinDeposit
        float balance
        int quotaPerQuarter
        float scholarshipPoolDonation
    **}**

    AH_ScholarshipPool **{**
        string ScholarshipID PK
        float amount
        date allocationDate
        relation CandidateID
        relation ActivityID
        string scholarshipType
        string criteria
    **}**

    AI_Enablers **{**
        string EnablerID PK
        string firstName
        string lastName
        string contactNumber
        string EnablerCertID FK
        string UserID FK
        string bio
        int clapCount
        string role
        relation accessedAnalytics
    **}**

    AJ_Division **{**
        string DivisionID PK
        string divisionName
        string gradeRange
        date startingDate
        date endingDate
        string academicYear
        relation GenreID
    **}**

    BA_EnablerCertifications **{**
        string EnablerCertID PK
        string EnablerID FK
        string CertID FK
        date expirationDate
        string awardedFor
    **}**

    BB_playerAnalytics **{**
        string analyticsID PK
        string PlayerID FK
        string ActivityID FK
        relation BallotResults
        json performanceMetrics
        json improvementAreas
        json strengthAreas
        relation EnablerInteraction
    **}**

    BC_Activities **{**
        string ActivityID PK
        string title
        string description
        string activityType
        string DivisionID FK
        string GenreID FK
        date startDate
        date endDate
        string chamberURL
        float membersFee
        int enrollmentCapacity
        int enrolledCount
        string activityFormat
        int enablerSlots
        relation RelatedResourceID
    **}**

    BD_Registrations **{**
        string RegistrationID PK
        string UserID FK
        relation TeamMateID
        relation SoloPlayerID
        string EnablerID FK
        string ActivityID FK
        date registrationDate
        datetime expirationDateTime
        string paymentStatus
        float paymentAmount
        string SuperID FK
        string role
    **}**

    BE_Teams **{**
        string TeamID PK
        string teamName
        string TeamFounder FK
        string GenreID FK
        string teamDescription
        string teamLogo
        string teamStatus
        string DivisionID FK
        relation TeamMessages
        relation TeamInvites
        relation TeamComm
    **}**

    BF_TeamMates **{**
        string TeamMateID PK
        string TeamID FK
        string PlayerID FK
        string role
        date departDate
    **}**

    BG_Invitations **{**
        string InvitationID PK
        string SenderPlayerID FK
        string SenderTeamMateID FK
        relation ReceiverPlayerID
        relation ReceiverTeamMateID
        relation RelatedObjectID
        string invitationStatus
        string invitationContents
        date proposedDate
        time proposedTime
        date acceptedDate
        time acceptedTime
        string DivisionID FK
        string GenreID FK
    **}**

    BH_Ballots **{**
        string BallotID PK
        string ActivityID FK
        string ReviewerID FK
        string result
        float scoreA
        float scoreB
        string writtenFeedback
        relation clappedBy
        relation relatedAnalytics
        boolean includedInAnalytics
    **}**

    BI_HallOfGame **{**
        string HoGID PK
        string ActivityID FK
        date eventDate
        string DivisionID FK
        string GenreID FK
        string TeamID FK
        relation SoloPlayerID
        json teamRankings
        json playerRankings
        string eventDetails
        json historicalRanking
    **}**

    BJ_PlayerRankings **{**
        string PlayerRankID PK
        string PlayerID FK
        string DivisionID FK
        int totalWins
        int totalLosses
        float latestScore
        float averageScore
        string rankingPosition
        int totalEventsPlayed
        json soloEventSpecificRankings
        string previousRank
        date archiveDate
        string tiedRanking
        string GenreID FK
    **}**

    CA_TeamRankings **{**
        string TeamRankID PK
        string TeamID FK
        string DivisionID FK
        int totalWins
        int totalLosses
        float latestScore
        float averageScore
        date lastUpdate
        string rankingPosition
        int totalEventsPlayed
        json teamEventSpecificRankings
        string previousRank
        date archiveDate
        string tiedRanking
        string GenreID FK
    **}**

    CB_Certifications **{**
        string CertID PK
        string certificationName
        relation issuingAuthority
        string certificationLevel
        string certificationImage
        string certificationDescription
        string DivisionID FK
        string GenreID FK
    **}**

    CC_Badges **{**
        string BadgeID PK
        string badgeType
        string badgeName
        string badgeDescription
        string badgeImage
        relation RelatedObjectID
        string DivisionID FK
        string GenreID FK
    **}**

    CD_ResourceMaterials **{**
        string ResourceID PK
        string title
        string description
        string content
        string GenreID FK
        date publishedDate
        string AuthorCurator FK
        int version
        relation ParentResourceID
        string accessLevel
        float averageRating
        int reviewCount
        json hashtags
        relation attachments
        relation markedHelpfulBy
        relation flaggedBy
    **}**

    CE_Ledger **{**
        string TransactionID PK
        string SuperID FK
        date transactionDate
        relation RelatedObjectID
        float amount
        string paymentMethod
        string paymentStatus
    **}**

    CF_paymentInfo **{**
        string paymentInfoID PK
        string EnablerID FK
        string paymentMethod
        string paymentDetail
        string paymentCycle
    **}**

    CG_ScholarshipRecipients **{**
        string RecipientID PK
        string ScholarshipID FK
        string PlayerID FK
        float amount
        date awardDate
        string status
        string remarks
    **}**

    CH_Payments **{**
        string PaymentID PK
        string EnablerID FK
        date paymentDate
        string description
        float amount
        string paymentInfoID FK
        string paymentStatus
        relation RenderedBallotID
        string enablerLevel
    **}**

    CI_callSignLog **{**
        string logID PK
        string UserID FK
        string previousCallSign
        string newCallSign
        date changeDate
        boolean changeApproved
        string reasonForChange
    **}**

    CJ_messages **{**
        string messageID PK
        string senderID FK
        relation receiverID
        string messageContent
        string messageType
        relation readBy
        relation attachment
        string status
        boolean isDelivered
    **}**

    DA_Communications **{**
        string CommunicationID PK
        string communicationType
        string title
        string content
        string postedBy
        string GenreID FK
        relation Relations
        string targetDivision
        relation ReadBy
        date expiryDate
        relation RelatedObjectID
    **}**

    DB_emCoinTransactions **{**
        string emCoinTransactionID PK
        string SuperID FK
        string creDebitType
        float amount
        relation BalanceTrigger
        string mpAddOnID FK
        relation relatedemCoinTransactions
    **}**

    DC_ResourceReviews **{**
        string ReviewID PK
        string ResourceID FK
        string ReviewerID FK
        int rating
        string comment
        string visibility
        boolean markedHelpful
        boolean flagged
        string flagReason
        relation ActivityID
        relation BadgeID
        relation ThumbsUp
        relation ThumbsDown
    **}**

    DD_Genres **{**
        string GenreID PK
        string genreName
        string DivisionID FK
        string genreDescription
        relation Organizers
        relation Sponsors
        relation Collaborators
        date approvalDate
    **}**

    DE_PlayerPersonality **{**
        string CharacterID PK
        json MBTI
        json OCEAN
        string PlayerID FK
        string visibility
        date expirationDate
    **}**

    DF_FileUpload **{**
        string FileID PK
        string Uploader FK
        relation TargetObjectID
        string fileName
        string fileDescription
        string sourceFile
        string hexName
        float size
    **}**

    DG_InstanceChamber **{**
        string InstanceID PK
        string ActivityID FK
        relation RSVPDateTime
        relation RollCall
        string chamberURL
        string issueReport
        string liveRecordingURL
        relation FileUploads
        relation EnablerBallotGen
        boolean decisionRendered
    **}**

    Users **||--o{** AC_Players **:** contains
    Users **||--o{** AE_Supervisors **:** contains
    Users **||--o{** AI_Enablers **:** contains

    AC_Players **||--o{** AD_PlayerBadges **:** earns

    AE_Supervisors **||--o{** AF_Subscriptions **:** manages
    AE_Supervisors **||--o{** AG_metaPassAddOns **:** has
    AE_Supervisors **||--o{** DB_emCoinTransactions **:** makes

    AI_Enablers **||--o{** BA_EnablerCertifications **:** holds
    AI_Enablers **||--o{** CH_Payments **:** receives
    AI_Enablers **||--o{** CJ_messages **:** sends
    AI_Enablers **||--o{** DF_FileUpload **:** uploads
    AI_Enablers **||--o{** BB_playerAnalytics **:** accesses
    AI_Enablers **||--o{** BC_Activities **:** hosts
    AI_Enablers **||--o{** BD_Registrations **:** registers

    AJ_Division **||--o{** BC_Activities **:** includes
    AJ_Division **||--o{** BE_Teams **:** includes
    AJ_Division **||--o{** BG_Invitations **:** sends
    AJ_Division **||--o{** BH_Ballots **:** submits
    AJ_Division **||--o{** BI_HallOfGame **:** participates
    AJ_Division **||--o{** BJ_PlayerRankings **:** contains
    AJ_Division **||--o{** CA_TeamRankings **:** includes
    AJ_Division **||--o{** CB_Certifications **:** issues
    AJ_Division **||--o{** CC_Badges **:** awards
    AJ_Division **||--o{** CD_ResourceMaterials **:** provides
    AJ_Division **||--o{** CE_Ledger **:** tracks
    AJ_Division **||--o{** CF_paymentInfo **:** uses
    AJ_Division **||--o{** CG_ScholarshipRecipients **:** receives
    AJ_Division **||--o{** CI_callSignLog **:** changes
    AJ_Division **||--o{** CJ_messages **:** sends
    AJ_Division **||--o{** DA_Communications **:** communicates
    AJ_Division **||--o{** DB_emCoinTransactions **:** processes
    AJ_Division **||--o{** DC_ResourceReviews **:** reviews
    AJ_Division **||--o{** DD_Genres **:** categorizes
    AJ_Division **||--o{** DE_PlayerPersonality **:** assesses
    AJ_Division **||--o{** DF_FileUpload **:** stores
    AJ_Division **||--o{** DG_InstanceChamber **:** manages