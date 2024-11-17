

// Array of Adobe Analytics topics
var analyticsTopics = [
    "AdobeLaunch",             // Adobe Launch (Tag Management)
    "Intigration-Target",             // Integration with Adobe Target for personalization
    "AnalysisWorkspace",       // Advanced analysis workspace in Adobe Analytics
    "Attribution",              // Attribution modeling
    "Integration-Campaigns",                // Tracking campaign performance (e.g., UTM parameters)
    "CustomerJourney",         // Customer journey analytics
    "DataFeed",                // Data feed integration for Adobe Analytics
    "DataSources",             // Data source management
    "DataWarehouse",           // Adobe Analytics data warehouse for large datasets
    "eVars",                    // eVars for persistent tracking
    "Events",                   // Custom events triggered on the website
    "MarketingChannels",       // Tracking of different marketing channels (e.g., Paid Search, Direct, Social)
    "MarketingChannelClassification", // Marketing channel classification for reporting
    "MobileAnalytics",         // Mobile app tracking
    "MobileSDK",               // Mobile SDK for app analytics tracking
    "PageViews",               // Basic page view tracking
    "Pathing",                  // Path analysis (e.g., flow of visitors through the site)
    "Props",                    // Props for page-level tracking
    "Reports&Dashboards",     // Custom reports and dashboards
    "Segments",                 // Custom segments
    "SiteSpeed",               // Page load and speed metrics
    "Tracking",                 // General tracking-related activities
    "TrackingCode",            // Implementation of tracking codes
    "UserInteraction",         // User interactions with content, media, etc.
    "WebSDK",                  // Web SDK for tracking and event forwarding on websites
    "VisitorLifecycle",        // Visitor engagement over time
    "CJA",                      // Customer Journey Analytics (CJA) data and reports
    "CustomVariables",         // Custom reporting variables
    "Audience",                 // Audience segmentation
    "DataGovernance"           // Data integrity and governance

];

// Function to sort the array alphabetically
function sortTopicsAlphabetically(topics) {
    return topics.sort((a, b) => a.localeCompare(b));
}

// Example usage: Sorting the analyticsTopics array alphabetically
var sortedAnalyticsTopics = sortTopicsAlphabetically(analyticsTopics);

// Log the sorted array
console.log(sortedAnalyticsTopics);

window.analyticsTags= sortedAnalyticsTopics;