CREATE DATABASE HistoricalViewpoints

USE HistoricalViewpoints

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Evidence](
	[EvidenveID] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Status] [nchar](10) NOT NULL,
	[ViewpointId] [uniqueidentifier] NULL,
	[HypothesisId] [uniqueidentifier] NULL,
	[FactionId] [uniqueidentifier] NULL,
	[ReferenceId] [uniqueidentifier] NULL,
	[Importance] [decimal](18, 4) NOT NULL,
	[Statement] [nvarchar](max) NULL,
	[UrlLinks] [nvarchar](max) NULL,
	[ReferenceName] [nvarchar](50) NULL,
	[Cite] [nvarchar](200) NULL,
	[Type] [nvarchar](100) NULL,
	[Confidence] [decimal](18, 4) NOT NULL,
	[ParentReferenceId] [uniqueidentifier] NULL,
 CONSTRAINT [PK_Evidence] PRIMARY KEY CLUSTERED 
(
	[EvidenveID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Faction](
	[FactionId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Faction] PRIMARY KEY CLUSTERED 
(
	[FactionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


CREATE TABLE [dbo].[Hypothesis](
	[HypothesisId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[FactionId] [uniqueidentifier] NOT NULL,
	[ViewpointId] [uniqueidentifier] NOT NULL,
	[BeginDate] [nvarchar](50) NOT NULL,
	[EndDate] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Hyposthesis] PRIMARY KEY CLUSTERED 
(
	[HypothesisId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


CREATE TABLE [dbo].[HypothesisEvidence](
	[HypothesisEvidenceId] [uniqueidentifier] NOT NULL,
	[EvidenceId] [uniqueidentifier] NOT NULL,
	[HypothesisId] [uniqueidentifier] NOT NULL,
	[ViewpointEvidenceId] [uniqueidentifier] NOT NULL,
	[ViewpointName] [nvarchar](200) NOT NULL,
	[EvidenceCitation] [nvarchar](500) NOT NULL,
	[EvidenceStatement] [nvarchar](500) NOT NULL,
	[HypothesisStatement] [nvarchar](500) NOT NULL,
	[Importance] [decimal](18, 4) NOT NULL,
	[EvidenceStatus] [nchar](10) NOT NULL,
	[UrlLinks] [nvarchar](max) NOT NULL,
	[EvidenceUrlLinks] [nvarchar](max) NOT NULL,
	[ReferenceName] [nvarchar](200) NOT NULL,
	[Cite] [nvarchar](200) NOT NULL,
	[Type] [nchar](10) NOT NULL,
	[Confidence] [decimal](18, 4) NOT NULL,
	[ParentReferenceId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_HypothesisEvidence] PRIMARY KEY CLUSTERED 
(
	[HypothesisEvidenceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Reference](
	[ReferenceId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Cite] [nvarchar](200) NOT NULL,
	[Type] [nchar](10) NOT NULL,
	[Confidence] [decimal](18, 4) NOT NULL,
	[ParentReferenceId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_Reference] PRIMARY KEY CLUSTERED 
(
	[ReferenceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[ViewPoint](
	[ViewPointId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[BeginDate] [nvarchar](200) NOT NULL,
	[EndDate] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_ViewPoint] PRIMARY KEY CLUSTERED 
(
	[ViewPointId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO





