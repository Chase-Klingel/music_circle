**Project name:** Music Circle

**The problem:** Users love Spotify because there are tailored playlists based on mood and genre and it’s clear to the user where to find those playlists. On the other hand, Soundcloud doesn’t have a well known feature focused on generating playlists. The interface is also clunky, which deters many people from trying the service. This is a major issue because the quality of music that can be found is incredible.

**The solution:** Music Circle takes care of the above issues by allowing users to select a genre and based on their selection, a tailored playlist is generated for them. It also has a 3 dimensional aspect that makes the experience both interactive, and more engaging than looking at a static stream of music.

**How it works:** When a user selects a genre, my server talks with soundcloud’s server via ajax. My server will then receive the top 50 songs for the genre chosen by the user. From there, my app selects 15 of the top 50 songs and present them as playable sounds in the form of a rotating, 3 dimensional carousel. I decided to use only the top 50 songs from every genre because my goal was to ensure user’s find the music to always be fresh.

**Web APIs used:** Soundcloud

**Core Languages used:** HTML, CSS, JavaScript

**Libraries used:** Tween JS, jQuery

**Valuable customer feedback:** The most important lesson I learned in this project was GET USER FEEDBACK. My project was stale and boring before I showed a few people and having them give me that honest feedback was incredibly valuable. One classmate gave me the idea to add a carousel feature and I ended up finding the 3d carousel, which I felt added greatly to the user experience in the end.

**Biggest challenge:** The biggest challenge for me was focusing on building one feature at a time. Before this project, I was a bit of a feature lunatic. I wanted a user to be able to do a million things. However, reflecting on the project, I realize that the best apps do one thing and they do that one thing really, really well. In this project, my issue was that I built out the ‘choosing a genre’ feature halfway and then I switched over to trying to build a ‘choose an artist’ feature. Going back and forth between the two proved to be a pretty messy situation. In the end, I was able to focus a majority of my efforts on the core feature of ‘choosing a genre.’ Now that my core feature is built, I can focus on the stretch goals.

**Stretch Goals**

1. Output playlists based on user’s mood
2. Continuous streaming
3. Display "now playing: artist name - song name" in an easy to locate area
4. Easily accessible play, pause, next and previous buttons

**Gratitude:** Huge thanks to John Blazek for the 3d Carousel feature
               https://codepen.io/johnblazek/pen/nceyw

## Landing Page
![Login Page](./img/music-circle.png?raw=true "Login Page")               
