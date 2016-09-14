((() => {
  SC.initialize({
    client_id: 'c6e1e2a98490d428460f8d36af919bb4'
  });

  let $nowPlaying = $('#now-playing');
  let showHelper = true;
  let queue = [];
  $('#enter-site').click(function() {
    $('#message').fadeOut();
    $('#content').delay(500).fadeIn();
    // displays intial carousel after user clicks 'enter'
    const initialCarousel = ((() => {
      // show toast on initial page load to help instruct user
      if (showHelper) {
        Materialize.toast('place mouse to the far right or far left of page \
        to speed up the carousel rotation', 4500);
      }
      // ajax request for top 50 electronic songs on soundcloud charts
      // https://soundcloud.com/charts/top?genre=electronic
      const $xhrElectronicMusic = $.getJSON(`https://cors-anywhere.herokuapp.com/https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3Aelectronic&client_id=c6e1e2a98490d428460f8d36af919bb4&limit=100&offset=0`);

      $xhrElectronicMusic.done(tracks => {
        if ($xhrElectronicMusic.status !== 200) {
          return;
        }

        initializeCarousel();
        iframeGenerator(tracks);
        prepQueue();
      });

      $xhrElectronicMusic.fail(err => {
        console.error(err);
      });

      // ensures toast only happens once
      showHelper = false;
    }))();
  });


  // genre menu variables
  const $genreMenu = $('<div class="animated fadeInLeft" id="genre-menu">');
  const $genreList = $('<ul class="animated fadeInLeft center" \
    id="genre-list">');
  const $genresHeader = $('<h4 class="animated fadeInLeft genre-header">\
  Genres</h4>');
  const $closeMenu = $('<i class="material-icons" id="close-menu">clear</i>');
  $genreMenu.append($closeMenu);
  $genreMenu.append($genresHeader);

  // about project variables
  const $aboutOverlay = $('<div class="animated fadeIn" id="about-overlay">');
  const $closeAbout = $('<i class="material-icons" id="close-about">clear</i>');
  $aboutOverlay.append($closeAbout);
  const $p1 = $('<p class="about"><span>Project name:</span> Music Circle</p><br>');
  const $p2 = $('<p class="about"><span>The problem:</span> Users love Spotify \
    because there are tailored playlists based on mood and  \
    genre and it’s clear to the user where to find those playlists.  \
    On the other hand, Soundcloud doesn’t have a well known feature focused \
    on generating playlists. The interface is also clunky, \
    which deters many people from trying the service. This is a major \
    issue because the quality of music that can be found is incredible.</p><br>');
  const $p3 = $('<p class="about"><span>The solution:</span> \
    Music Circle takes care of the above issues by allowing users \
    to select a genre and based on their selection, a tailored playlist \
    is generated for them. It also has a 3 dimensional aspect that makes \
    the experience both interactive, and more engaging than looking at \
    a static stream of music.</p><br>');
  const $p4 = ('<p class="about"><span>How it works:</span> \
    When a user selects a genre, my server talks with soundcloud’s \
    server via ajax. My server will then receive the top 50 songs for the \
    genre chosen by the user. From there, my app selects 15 of the top \
    50 songs and present them as playable sounds in the form of a rotating, \
    3 dimensional carousel. I decided to use only the top 50 songs from every \
    genre because my goal was to ensure user’s find the music to always \
    be fresh.</p><br>');
  const $p5 = $('<p class="about"><span>Web APIs used:</span> Soundcloud</p><br>');
  const $p6 = $('<p class="about"><span>Core Languages used:</span> HTML, \
    CSS, JavaScript</p><br>');
  const $p7 = $('<p class="about"><span>Libraries used:</span> Tween JS, \
    jQuery</p><br>')
  const $p8 = $('<p class="about"><span>Valuable customer feedback:</span> \
    The most important lesson I learned in this project was GET USER FEEDBACK. \
    My project was stale and boring before I showed a few people and having \
    them give me that honest feedback was incredibly valuable. One classmate \
    gave me the idea to add a carousel feature and I ended up finding the 3d\
    carousel, which I felt added greatly to the user experience in the end.</p><br>');
  const $p9 = $('<p class="about"><span>Biggest challenge:</span> The biggest \
    challenge for me was focusing on building one feature at a time. Before \
    this project, I was a bit of a feature lunatic. I wanted a user to be able \
    to do a million things. However, reflecting on the project, I realize that \
    the best apps do one thing and they do that one thing really, really well. \
    In this project, my issue was that I built out the ‘choosing a genre’ \
    feature halfway and then I switched over to trying to build a ‘choose \
    an artist’ feature. Going back and forth between the two proved to be a \
    pretty messy situation. In the end, I was able to focus a majority of my \
    efforts on the core feature of ‘choosing a genre.’ Now that my core \
    feature is built, I can focus on the stretch goals.</p><br>');
  const $goals = $('<ol class="about goals-list"><h4 class="goals"> \
      Stretch Goals</h4> \
      <li>Output playlists based on user’s mood</li> \
      <li>Continuous streaming</li> \
      <li>Display "now playing: artist name - song name" in an easy to \
      locate area</li> \
      <li>Easily accessible play, pause, next and previous buttons</li> \
    </ol><br>')
  const $gratitude = $('<p class="about"><span>Gratitude:</span> Huge thanks \
    to John Blazek for the 3d Carousel feature</p><br>');

  $aboutOverlay.append($p1, $p2, $p3, $p4, $p5, $p6, $p7, $p8, $p9, $goals, $gratitude);

  $('#read-project').click(function() {
    $('body').prepend($aboutOverlay);
    $aboutOverlay.show();
  });

  $closeAbout.click(function() {
    $aboutOverlay.hide();
  });

  // Thanks to @johnblazek for lines 7 - 109 to create the carousel effect
  // source: https://codepen.io/johnblazek/pen/nceyw
  let w;

  let container;
  let carousel;
  let item;
  let radius;
  let itemLength;
  let rY;
  let ticker;
  let fps;
  let mouseX = 0;
  let mouseY = 0;
  let mouseZ = 0;
  let addX = 0;

  const fps_counter = {

  	tick() {
      // this has to clone the array every tick so that
      // separate instances won't share state
      this.times = this.times.concat(+new Date());
      let seconds;
      const times = this.times;

      if (times.length > this.span + 1)
      {
          times.shift(); // ditch the oldest time
          seconds = (times[times.length - 1] - times[0]) / 1000;
          return Math.round(this.span / seconds);
      }
      else return null;
    },

  	times: [],
  	span: 20
  };

  const counter = Object.create(fps_counter);

  // animates tracks as they come into view
  const animateIn = function($item, $block) {
    const $nrX = 360 * getRandomInt(2);
    const $nrY = 360 * getRandomInt(2);

    const $nx = -(2000) + getRandomInt(4000);
    const $ny = -(2000) + getRandomInt( 4000);
    const $nz = -4;
    `000${getRandomInt(4000)}`

    const $s = 1.5 + (getRandomInt( 10 ) * .1);
    const $d = 1 - (getRandomInt( 8 ) * .1);

    TweenMax.set( $item, { autoAlpha:1, delay:$d } )
    TweenMax.set( $block, { z:$nz, rotationY:$nrY, rotationX:$nrX, x:$nx,
      y:$ny, autoAlpha:0} )
    TweenMax.to( $block, $s, { delay:$d, rotationY:0, rotationX:0, z:0,
      ease:Expo.easeInOut} )
    TweenMax.to( $block, $s-.5, { delay:$d, x:0, y:0, autoAlpha:1,
      ease:Expo.easeInOut} )
  }

  // controls speed of carousel based on user movement
  const onMouseMove = function(event) {
    mouseX = -(-(window.innerWidth * .5) + event.pageX) * .0001;
    mouseY = -(-(window.innerHeight * .5) + event.pageY ) * .0001;
    mouseZ = -(radius) - (Math.abs(-(window.innerHeight * .5)
    + event.pageY ) - 200);
  }

  // loops and sets the carousel 3d properties
  const looper = function() {
    addX += mouseX
    TweenMax.to( carousel, 1, { rotationY:addX, rotationX:mouseY,
      ease:Quint.easeOut } )
    TweenMax.set( carousel, {z:mouseZ } )
    fps.text( `Framerate: ${counter.tick()}/60 FPS` )
  }

  // used in animateIn function
  const getRandomInt = function($n) {
    return Math.floor((Math.random()*$n)+1);
  }

  // brings tracks into view
  const initializeCarousel = function() {
    w = $(window);
    container = $('#contentContainer');
    carousel = $('#carouselContainer');
    item = $('.carouselItem');
    itemLength = $('.carouselItem').length;
    fps = $('#fps');
    rY = 360 / itemLength;
    radius = Math.round( (250) / Math.tan( Math.PI / itemLength ) );

    // set container 3d props
    TweenMax.set(container, {perspective: 600})
    TweenMax.set(carousel, {z:-(radius)})

    // create carousel item props

    for (let i = 0; i < itemLength; i++) {
      const $item = item.eq(i);
      const $block = $item.find('.carouselItemInner');

      //thanks @chrisgannon!
      TweenMax.set($item, {rotationY:rY * i, z:radius,
        transformOrigin:`50% 50% ${-radius}px`});

      animateIn( $item, $block )
    }

    // set mouse x and y props and looper ticker
    window.addEventListener( "mousemove", onMouseMove, false );
    ticker = setInterval( looper, 1000 / 400);
  }

  // Displays 29 genres when user clicks 'select genre' button
  const showGenres = function() {
    $genreMenu.show();

    const genres = {
      genre1: 'alternativerock',
      genre2: 'ambient',
      genre3: 'classical',
      genre4: 'country',
      genre5: 'danceedm',
      genre6: 'deephouse',
      genre7: 'disco',
      genre8: 'drumbeats',
      genre9: 'dubstep',
      genre10: 'electronic',
      genre11: 'folksingersongwriter',
      genre12: 'hiphoprap',
      genre13: 'house',
      genre14: 'indie',
      genre15: 'jazzblues',
      genre16: 'latin',
      genre17: 'metal',
      genre18: 'piano',
      genre19: 'pop',
      genre20: 'rbsoul',
      genre21: 'reggae',
      genre22: 'reggaeton',
      genre23: 'rock',
      genre24: 'soundtrack',
      genre25: 'techno',
      genre26: 'trance',
      genre27: 'trap',
      genre28: 'triphop',
      genre29: 'world'
    };

    // creates li, adds a genre as the text content, and appends to ul
    for (let i = 1; i <= 29; i++) {
      const $li = $('<li class="genre-item">');

      $li.text(genres[`genre${i}`]);
      $genreList.append($li);
    }

    $genreMenu.append($genreList);
    $('body').prepend($genreMenu);
  }

  // show genre menu when user clicks 'select genre' button
  $('#genre-button').click(showGenres);

  // hide genre menu when user clicks 'x' || clicks a genre
  $genreMenu.click(() => {
    $genreMenu.hide();
  });

  // generates the iframes to be placed into view
  const iframeGenerator = tracks => {
    // determines how many songs are in 'collection' array
    const collectionLength = tracks.collection.length;
    // used to keep track of what songs are already embedded in an iframe
    const randomTrackArr = [];

    for (let i = 1; i <= 15; i++) {
      let randomTrackFound = false;

      // random number between 0 and collection array's length
      let randomTrack = Math.floor((Math.random() * collectionLength));

      // Ensures every iframe is a unique song
      while (randomTrackFound === false) {
        // get random number
        randomTrack = Math.floor((Math.random() * collectionLength));
        // If number has not been used...
        if (!randomTrackArr.includes(randomTrack)) {
          // push number to randomTrackArr
          randomTrackArr.push(randomTrack);
          // random/unused number is found and the while loop will exit
          randomTrackFound = true;
        } else {
          // random number not found. continue looking for random number...
          continue;
        }
      }

      /* accesses random index of an array containing objects that
         represent songs and gets the url to create the iframe
      */
      let url = `https://w.soundcloud.com/player/?visual=true&url=${tracks.collection[randomTrack].track.permalink_url}`;
      let $iframe = $(`<iframe class="frame" id="iframe${i}" src=${url} width="100%" height="400" scrolling="no" frameborder="no"></iframe>`);
      $(`#track${i}`).append($iframe);
      queue.push(document.getElementById(`iframe${i}`));
    }
  };

  function prepQueue() {
    for (let i = 0; i < queue.length; i++) {
      let currentIframe = queue[i].id;
      let currentWidget = SC.Widget(currentIframe);
      let nextIframe = queue[i + 1].id;
      let nextWidget = SC.Widget(nextIframe);
      currentWidget.bind(SC.Widget.Events.PLAY, function() {
        currentWidget.getCurrentSound(function(music){
          let $link = $(`<a id="soundcloud-link" target="_blank" href=${music.permalink_url}><img src="img/soundcloud.png"></a>`);
          $nowPlaying.text(`Now Playing: ${music.title}`);
          $('body').append($nowPlaying);
          $nowPlaying.append($link);
        });
      });

      currentWidget.bind(SC.Widget.Events.FINISH, function() {
        nextWidget.play();
      });
    }
    Materialize.toast('check', 1000);
  }

  // when user clicks submit...
  $($genreList).click(event => {
    $nowPlaying.text('');
    $('.frame').remove();
    const genre = event.target.textContent;

    /* fetches the json data for the top 50 tracks currently on soundcloud
      for the genre the user inputs.
    */
    const $xhrGenre = $.getJSON(`https://cors-anywhere.herokuapp.com/https://api-v2.soundcloud.com/charts?kind=top&genre=soundcloud%3Agenres%3A${genre}&client_id=c6e1e2a98490d428460f8d36af919bb4&limit=50&offset=0`);

    $xhrGenre.done(tracks => {
      if ($xhrGenre.status !== 200) {
        return;
      }

      iframeGenerator(tracks);
      prepQueue();
    });

    $xhrGenre.fail(err => {
      console.error(err);
    });
  });
})());
