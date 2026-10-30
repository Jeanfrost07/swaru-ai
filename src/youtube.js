export async function fetchRelevantVideos(topicQuery) {
  // API key ki zarurat nahi, direct smart search links generate karenge
  try {
    const query = encodeURIComponent(topicQuery + " tutorial in hindi");
    
    const gradients = [
      'from-blue-500/20 to-blue-500/0',
      'from-emerald-500/20 to-emerald-500/0',
      'from-purple-500/20 to-purple-500/0'
    ];

    // Dummy UI cards jo seedha YouTube Search par le jayenge
    return [
      {
        id: "vid-1",
        title: `${topicQuery} - Complete Tutorial Hindi`,
        channel: "Click to watch on YouTube",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop&q=80", // YouTube style thumbnail
        url: `https://www.youtube.com/results?search_query=${query}`,
        gradient: gradients[0],
        views: "Recommended", 
        duration: "Playlist"
      },
      {
        id: "vid-2",
        title: `${topicQuery} - One Shot Crash Course`,
        channel: "Click to watch on YouTube",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=640&h=360&fit=crop&q=80", // Coding thumbnail
        url: `https://www.youtube.com/results?search_query=${query}+one+shot`,
        gradient: gradients[1],
        views: "Trending", 
        duration: "One Shot"
      },
      {
        id: "vid-3",
        title: `${topicQuery} - Interview Questions`,
        channel: "Click to watch on YouTube",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=360&fit=crop&q=80", // Desk thumbnail
        url: `https://www.youtube.com/results?search_query=${query}+interview+questions`,
        gradient: gradients[2],
        views: "Important", 
        duration: "Q&A"
      }
    ];
  } catch (error) {
    return [];
  }
}