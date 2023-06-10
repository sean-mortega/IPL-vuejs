// global
Vue.use(window.vuelidate.default);

// local mixin
var validationMixin = window.vuelidate.validationMixin;
const {
    required,
    minLength, 
    maxLength,
} = window.validators;

//axios.defaults.baseURL = 'https://wcp-api-test.rgbhu.io';
// update to production by Jason
axios.defaults.baseURL = apiUrl;

var app = new Vue({
    el: '#app',
    data: {
        countryCode: 91,
        otp: null,
        mobileNumber: null,
        maxChars: 10,
        languages: [],
        teams: [],
        formErrors: [],
        predictionResults: [],
        isSelected: false,
        instructions: false,
        successPrediction: false,
        showPredResults: false,
        errorOTP: false,
        errorOTPused: false,
        wrongOTP: false,
        otpSent: false,
        errorInvalidPhone: false,
        isRegisterClicked: false,
        errorPrediction: false,
        predictRecordExist: false,
        phoneNumberLength: 10,
        tickerTime: '0:00',
        predStartTime: 0,
        predEndTime: 0,
        predId: 0,
        getInfoResult: [],
        errorMessage: '',
        selectedPrediction: '',
        predictionTotal: 0,
        predictionResultA: 0,
        predictionResultB: 0,
        styleObject: {},
        predictionData: [],
        hasContent: false,


        /* new variables */
        showHowtoPlay: false,
        showPlayNow: false,
        showLeaderboards: false,
        showResultsPage: false,
        showPrizes: false,
        isLoading: false,
        userName: '',

        howToPlayData: [],

        /* play now */
        playNow__group_teamsData: [],
        playNow__group_competitors: [],
        playNow__scheduleData: [],
        playNow__selected_group: 'A',
        playNow__selected_matchId: 1,
        playNow__selected_groupId: 1,

        playNow__submitPrediction: false,
        
        playNow__prediction_form: {
            "UserName": "testName",
            "GroupId": 1,
            "PredictorData": [
              {
                "GroupId": "",
                "MatchId": "",
                "TeamAResult": "",
                "TeamBResult": ""
              },
              {
                "GroupId": "",
                "MatchId": "",
                "TeamAResult": "",
                "TeamBResult": ""
              },
              {
                "GroupId": "",
                "MatchId": "",
                "TeamAResult": "",
                "TeamBResult": ""
              },
              {
                "GroupId": "",
                "MatchId": "",
                "TeamAResult": "",
                "TeamBResult": ""
              },
              {
                "GroupId": "",
                "MatchId": "",
                "TeamAResult": "",
                "TeamBResult":  ""
              },
              {
                "GroupId": "",
                "MatchId": "",
                "TeamAResult":  "",
                "TeamBResult":  ""
              }
            ]
          },

        /* results */
        results_latestData: [],
        results_allData: [],
        results_allDataUi: [],

        /* League Table */
        league__userScores: [],
        league__list_top: [],
        league__list_self: [],
        topScores: false,
        selfScores: true,
        myPosition: '',

        submitBtnShow: false,
        editBtnShow: true,


        showResOverlay: false,
        incorrectScore: false,
        invalidForm: false,
        hostName: '',
        cancelButtonShow: false


    },
    validations: {
        
        
        playNow__prediction_form: {
            PredictorData: {
                $each: {
                    TeamAResult: 
                    { required,
                        integer: validators.integer,
                        maxLength: maxLength(2) },
                    TeamBResult: 
                    { required,
                        integer: validators.integer,
                        maxLength: maxLength(2) }
                }
            }
        }
    },

    methods: {
        
        opentr :function( position ) {

            var that = this;

            /* find the TR Containing the passed position*/
            /* find the parent element*/
            /* append the new TR*/
            /* button binding for SHOW TOP 10 etc using jquery*/


            /* step 1 */

            $('#lt tr').each(function() {
                var position = Number($(this).find("td:first").html()); 
            
                if(that.myPosition === position ) {

                    var parentEl = $(this).find("td:first");
                    console.log(parentEl[0])

                    const currTR = parentEl[0].closest('tr');

                    console.log(currTR);

                    // var newTR = document.createElement("tr");
                    // newTR.classList.add('myPos');
                    // newTR.classList.add('expand');

                    // newTR.innerHTML = `<tr class="myPos expand"><td colspan="7"><button class="btn cta-button uppercase" style="border: 0px solid var(--accent-blue); color: #fff !important; width: 50vh;" v-on:click="getPointsByUser( 'top'); topScores=true; selfScores=false">Show Top 10</button></td></tr>`;
                    // currTR.parentNode.insertBefore(newTR, currTR.next);
                }
             });


            /* add if*/
            // const currTR = event.target.closest('tr');
            // var newTR = document.createElement("tr");
            // newTR.classList.add('myPos');
            // newTR.classList.add('expand');

            // newTR.innerHTML = `<tr class="myPos expand"><td colspan="7"><button class="btn cta-button uppercase" style="border: 0px solid var(--accent-blue); color: #fff !important; width: 50vh;" v-on:click="getPointsByUser( 'top'); topScores=true; selfScores=false">Show Top 10</button></td></tr>`
            // currTR.parentNode.insertBefore(newTR, currTR.nextSibling);
        },

        closetr :function(event) {
            const currTR = event.target.closest('tr');
            var nextTR = currTR.nextSibling;
            document.getElementById("lt").deleteRow(nextTR.rowIndex);
        },

        checkFormInit() {

            var that = this;
    

            /* get prediction datas here init*/
            for ( var i= 0; i < this.playNow__scheduleData.length; i++ ) {
                if( this.playNow__scheduleData[i].TeamAPrediction === '?' ||
                this.playNow__scheduleData[i].TeamBPrediction === '?') {
                    console.log('call init');
                    this.invalidForm = true;
                } 
            }
    
        },


        convertTime: function( timeVal ) {

            var dt = new Date(timeVal);
            
            let tm = new Intl.DateTimeFormat('en', { timeStyle: 'short' }).format(dt);
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dt);
            let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(dt);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dt);
            
            return `${tm} | ${da} ${mo} ${ye}`; 


        },

        convertTZ:function( date ) {

            var clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // this.convertTime( new Date((typeof date === "string" ? new Date(date) : date). toLocaleString("en-US", {timeZone: clientTimeZone })) );   

            return this.convertTime( new Date( date ).toLocaleString('en-US', { timeZone: clientTimeZone }));
            


        },

        expandTableRow: function() {
            
            // after click on leaderboard row, add another row

        },


        switchPage: function( page ) {

            var that = this;

            that.successPrediction = false;

            if(page === 1) {
                this.showHowtoPlay =  true;
                this.showPlayNow =  false;
                this.showLeaderboards =  false;
                this.showResultsPage =  false;
                this.showPrizes = false;
                document.getElementById( 'howToPlayM' ).classList.add('activex');
                document.getElementById( 'playNowM' ).classList.remove('activex');
                document.getElementById( 'leagueTableM' ).classList.remove('activex');
                document.getElementById( 'resultsM' ).classList.remove('activex');
                //  document.getElementById( 'prizesM' ).classList.remove('activex');.classList.remove('activex');
                
                setTimeout(function() {
                    $( "#clickP" ).on( "click", function() {
                      that.redirectToBonus();
                    });
                  }, 500);

                  
            } else if( page === 2 ) {
                this.showHowtoPlay =  false;
                this.showPlayNow =  true;
                this.showLeaderboards =  false;
                this.showResultsPage =  false;
                this.showPrizes = false;
                document.getElementById( 'howToPlayM' ).classList.remove('activex');
                document.getElementById( 'playNowM' ).classList.add('activex');
                document.getElementById( 'leagueTableM' ).classList.remove('activex');
                document.getElementById( 'resultsM' ).classList.remove('activex');
                //  document.getElementById( 'prizesM' ).classList.remove('activex');.classList.remove('activex');

                setTimeout( function(){
            
                    /* for highlight */
                    $('.group-nav__wrap li').click(function(){
                
                        console.log( 'clicked 2');
                        $('.active').removeClass('active');
                        $(this).addClass('active');
                    
                    });
                
                }, 1500);

                that.editBtnShow = true;
                that.cancelButtonShow = false;
                that.submitBtnShow = false;

            } else if( page === 3 ) {

                
                this.showHowtoPlay =  false;
                this.showPlayNow =  false;
                this.showLeaderboards =  true;
                this.showResultsPage =  false;
                this.showPrizes = false;
                
                that.selfScores = true;
                that.topScores = false;
                that.getPointsByUser( 'self');

                document.getElementById( 'howToPlayM' ).classList.remove('activex');
                document.getElementById( 'playNowM' ).classList.remove('activex');
                document.getElementById( 'leagueTableM' ).classList.add('activex');
                document.getElementById( 'resultsM' ).classList.remove('activex');
                //  document.getElementById( 'prizesM' ).classList.remove('activex');.classList.remove('activex');

                  
                  
            } else if( page === 4 ) {
                this.showHowtoPlay =  false;
                this.showPlayNow =  false;
                this.showLeaderboards =  false;
                this.showResultsPage =  true;
                this.showPrizes = false;
                document.getElementById( 'howToPlayM' ).classList.remove('activex');
                document.getElementById( 'playNowM' ).classList.remove('activex');
                document.getElementById( 'leagueTableM' ).classList.remove('activex');
                document.getElementById( 'resultsM' ).classList.add('activex');
                //  document.getElementById( 'prizesM' ).classList.remove('activex');.classList.remove('activex');

                setTimeout( function(){
            
                    /* for highlight */
                    $('.group-nav__wrap li').click(function(){
                
                        console.log( 'clicked 2');
                        $('.active').removeClass('active');
                        $(this).addClass('active');
                    
                    });
                
                }, 1500);
                

                 // display in carousel mode 
                try {
                    $(document).ready(function(){
                        $('.lr-carousel').slick({
                            slidesToShow: 2,
                            infinite: true,
                            dots: false,
                            centerMode: true,
                            autoplay: true,
                            autoplaySpeed: 2000,
                            responsive: [
                                {
                                  breakpoint: 867,
                                  settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    infinite: true,
                                  }
                                }
                              ]
                        });
                    });
                } catch(err) {
                    console.info('cannot find target');
                }

            }

            else if( page === 5 ) {

                //prizes
                this.showHowtoPlay =  false;
                this.showPlayNow =  false;
                this.showLeaderboards =  false;
                this.showResultsPage =  false;
                this.showPrizes = true;

                document.getElementById( 'howToPlayM' ).classList.remove('activex');
                document.getElementById( 'playNowM' ).classList.remove('activex');
                document.getElementById( 'leagueTableM' ).classList.remove('activex');
                document.getElementById( 'resultsM' ).classList.remove('activex');
                //  document.getElementById( 'prizesM' ).classList.remove('activex');.classList.add('activex');

            }

        },


        enableInputs: function() {

            var that = this;

            that.editBtnShow = false;
            that.submitBtnShow = true;
            that.cancelButtonShow = true;

            console.log( 'edit button clicked');

            for( var i=0; i< $(".score").children('input').length; i++ ) {
                
                if( $(".score").children('input')[i]._value !== '' || $(".score").children('input')[i]._value === '?' ) {
                    $(".score").children('input')[i].disabled = false;

                }

            }

            //$('input').prop('disabled', false);

            //$('.score a').removeClass('disabled');

            $('.match-item__selection').removeClass('disabled');



        },

        clickConfirm: function() {

            // check all input with value
            // disable them again one by one
            // show the edit Button again


        },



        generateChart: function( index, stats ) {
            

            // static data for now...

            setTimeout( function() {

                try {

                    var ctx = document.getElementById('graph' + index ).getContext('2d');
                    var gradientStroke = ctx.createLinearGradient(50, 150, 0, 100);
                    gradientStroke.addColorStop(0, '#00BBE4');
                    gradientStroke.addColorStop(1, '#fe009a' );


                    var chart = new Chart(ctx, {
                        // The type of chart we want to create
                        type: 'doughnut',
                        // The data for our dataset
                        data: {
                            //labels: ["Played" , "Unplayed"],
                            datasets: [{
                                //label: "Score",
                                data: [stats['a1'], stats['a2']],
                                backgroundColor: [ gradientStroke, "#ECECEC" ],
                            }]
                        },
                        
                        // Configuration options go here
                        options: {
                            cutoutPercentage: 65,
                            responsive: true,
                            legend: {
                                    display: false,
                                },
                            tooltips: {
                                    enabled: false,
                                    mode: 'index',
                                callbacks: {
                                    label: function (tooltipItems, data) {
                                        var i, label = [], l = data.datasets.length;
                                        for (i = 0; i < l; i += 1) {
                                            label[i] = data.datasets[i].label + ': ' + data.datasets[i].data[tooltipItems.index] + '%';
                                        }
                                        return label;
                                    }
                                }
                            },
                            hover: {
                                mode: null
                            },
                            elements: {
                                center: {
                                    text: stats['a1'],
                                    color: '#14022A', // Default is #000000
                                    fontStyle: 'Roboto', // Default is Arial
                                    sidePadding: 20 // Defualt is 20 (as a percentage)
                                    }
                            }
                        }

                    });
                } catch(err) {

                }
                

                
            });


        },


        

        isMobile: function() {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                return true;
            }
            return false;
        },




        showInstructions: function() {
            this.instructions = true;
            $('#myModal').fadeIn('slow');
            (function fun() {
                $('.modal-content').css({
                    'transform': 'translateY(150px)'
                });
            })();
        },



        hideModals: function() {
            $('#myModal').fadeOut('fast');
            /* reset modal content */
            //this.successPrediction = false;
            this.instructions = false;
            this.otpSent = false;
            this.errorOTP = false;
            this.errorPrediction = false;
            this.errorOTPused = false;
            this.errorInvalidPhone = false;
            this.errorMessage = '';
        },


        placeABet: function(){
            
            /*
            Desktop: https://{hostname}/#/sport/?menuType=0&type=0&sport=1
            Mobile: https://{hostname}/en/sports/pre-match/event-view/Soccer/World/2969
            */

            var that = this;

            let desktopDomain = (new URL(that.hostName));
            console.log(desktopDomain, desktopDomain.hostname);

            let redLink = that.isMobile() === true 
            ? `https://${that.hostName}/en/sports/pre-match/event-view/Soccer/World/2969` 
            : `https://${desktopDomain.hostname}/#/sport/?type=0&sport=1&menuType=0&popularCompetition=2969`
            
            console.log(redLink);
            setTimeout(function(){
                window.open(redLink, '_blank').focus();
            }, 700);
            
        },

        redirectToBonus: function() {

            var that = this;

            let desktopDomain = (new URL(that.hostName));

            

            let redLink = that.isMobile() === true 
            ? `https://${that.hostName}/iframe/sport?showTo=1&src=https%3A%2F%2Fwcp-frontend-v4xqca5v.happistar.info%2F%3Fjwt%3D{jwe}%26lang%3D{language}%26host%3D{host}` 
            : `https://${desktopDomain.hostname}/#/bonus-and-promo`
            
            console.log(redLink);
            setTimeout(function(){
                window.open(redLink, '_blank').focus();
            }, 700);
        },



        shouldAppendErrorClass: function(field) {
            return field.$error || field.$invalid;
        },



        redirectToChoose: function() {
            setTimeout(function() {
                window.location.href = "#choose-Team";
            }, 200);
        },


        redirectToRegister: function() {

            //hide step 1
            $('.top-banner').addClass('hideThis');
            $('.predition-msg-wrap').addClass('hideThis');
            $('.predictions-choose-wrap').addClass('hideThis');
            $('.register-wrap').removeClass('hideThis');
            setTimeout(function() {
                window.location.href = "#step-2";
            }, 200);
        },




        addScore( index, team ) {    


            var that = this;

            //we now have the index, we have the value
            //get if team A or team B
            //handle if questionmark

            if( team === 'A') {

                that.playNow__prediction_form.PredictorData[ index ].TeamAResult === '' ?
                that.playNow__prediction_form.PredictorData[ index ].TeamAResult = 1
                : that.playNow__prediction_form.PredictorData[ index ].TeamAResult = parseInt(  that.playNow__prediction_form.PredictorData[ index ].TeamAResult || 0 ) + 1;

            } else {

                that.playNow__prediction_form.PredictorData[ index ].TeamBResult === '' ?
                that.playNow__prediction_form.PredictorData[ index ].TeamBResult = 1
                : that.playNow__prediction_form.PredictorData[ index ].TeamBResult = parseInt(  that.playNow__prediction_form.PredictorData[ index ].TeamBResult || 0 ) + 1;
            }            
            
        },

        subtractScore ( index, team ) {

            var that = this;

            if( team === 'A') {

                that.playNow__prediction_form.PredictorData[ index ].TeamAResult === '' || that.playNow__prediction_form.PredictorData[ index ].TeamAResult < 1 ?
                that.playNow__prediction_form.PredictorData[ index ].TeamAResult = 0
                : that.playNow__prediction_form.PredictorData[ index ].TeamAResult = parseInt(  that.playNow__prediction_form.PredictorData[ index ].TeamAResult || 0 ) - 1;

            } else {

                that.playNow__prediction_form.PredictorData[ index ].TeamBResult === '' || that.playNow__prediction_form.PredictorData[ index ].TeamBResult < 1  ?
                that.playNow__prediction_form.PredictorData[ index ].TeamBResult = 0
                : that.playNow__prediction_form.PredictorData[ index ].TeamBResult = parseInt(  that.playNow__prediction_form.PredictorData[ index ].TeamBResult || 0 ) - 1;
            }      

        },







        /* ==================
        
        REST functions 
        
        ===================== */




        /* 
            GET Info for How to Play page
         */


        getHowToPlay: function() {
            var that = this;
            try {
                axios.post('/getHowToPlay', 
                    {
                        "Device": that.isMobile() === true ? 'Mobile' : 'Desktop',
                        "Lang": "EN"
                    })
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                            that.howToPlayData = response.data.data;
                            localStorage.setItem('targetDate', that.howToPlayData.WcpStartTime );
                        } else {
                            console.log(
                             'no how to play data'   
                            );
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            } catch (error) {
                console.info(error);
            }
        },







        /* 
        Get info display all teams
        */
        
        getAllTeams: function() {
            var that = this;
            try {
                axios.get('/getTeams')
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                            if( response.data.data) {
                            
                                that.playNow__group_teamsData = response.data.data;

                                if ( that.playNow__group_teamsData !== [] ) {
                                    that.selectGroup( 'A' );
                                } else {
                                    // display fetching teams UI
                                }

                            } else {
                                // mock data
                               // display fetching teams UI
                            }
                    
                        } else {
                            console.log(
                             'no team Data'   
                            );
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            } catch (error) {
                console.info(error);
            }
        },






        /* get by GroupName */

        selectGroup: function( group ) {

            // put promises here




            var that = this;

            that.invalidForm = false;
            that.successPrediction = false;

            that.playNow__group_competitors = that.playNow__group_teamsData[ group ];

            // set text for selected group
            that.playNow__selected_group = group;

            that.getSchedule();

            that.editBtnShow = true;
            that.cancelButtonShow = false;
            that.submitBtnShow = false;


            // disable all prediction box 

            for( var i=0; i< $(".score").children('input').length; i++ ) {
                
                if( $(".score").children('input')[i]._value !== '' ) {
                    $(".score").children('input')[i].disabled = true;

                }

            }

            
            var unpredictedItems = 0;
            for( var i=0; i< $(".score").children('input').length; i++ ) {
                

                if( $(".score").children('input')[i]._value === '' ||  $(".score").children('input')[i]._value === '?' ) {
                    unpredictedItems = unpredictedItems + 1;
                    $(".score").children('input')[i].disabled = false;

                }

            }

            $('.match-item__selection').addClass('disabled');



            console.log( unpredictedItems );
            if( unpredictedItems === 12) {
                $('.match-item__selection').removeClass('disabled');
                // that.editBtnShow = false;
                // that.submitBtnShow = true;
            }



        },




        selectResultByGroup: function( group ) {

            var that = this;

            that.results_allDataUi = that.results_allData[ group ];

        },



        
        initChart: function() {

            var that = this;
            // show donut chart League Points
                
            var { 
                GamesPlayed,
                CorrectResult,
                CorrectScore,
                PointsFromCorrectResult,
                PointsFromCorrectScore 
                }  = that.league__userScores;
            
            GamesPlayed = GamesPlayed || 0;
            CorrectResult = CorrectResult || 0;
            CorrectScore = CorrectScore || 0;
            PointsFromCorrectResult = PointsFromCorrectResult || 0;
            PointsFromCorrectScore = PointsFromCorrectScore || 0;
            
            var cData = [
                        { 
                            "a1" : ( GamesPlayed  / 48 ) * 48,
                            "a2": 48 - (( GamesPlayed  / 48 ) * 48)
                        },
                        { 
                            "a1" : ( GamesPlayed  / 48 ) * 48,
                            "a2": 48 - (( GamesPlayed  / 48 ) * 48)
                        },
                        {
                            "a1" : ( CorrectResult  / 48 ) * 48,
                            "a2": 48 - (( CorrectResult  / 48 ) * 48)
                        },
                        {
                            "a1" : ( CorrectScore  / 48 ) * 48,
                            "a2": 48 - (( CorrectScore  / 48 ) * 48)
                        },
                        {
                            "a1" : ( PointsFromCorrectResult   / 48 ) * 48,
                            "a2": 48 - (( PointsFromCorrectResult   / 48 ) * 48)
                        },
                        {
                            "a1" : ( PointsFromCorrectScore   / 48 ) * 48,
                            "a2": 48 - (( PointsFromCorrectScore  / 48 ) * 48)
                        }
                    ]
            
        
            for ( var i=0; i < cData.length; i++ ) {

                that.generateChart( i >1 ? i : '', cData[i] );

            }


        },


        /* D-344 */

        getPointsExtra: function() {
            var that = this;
            try {


                // get points top users
                axios.get('/getPointsByUserExtra' )
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                            if( response.data.data) {

                                console.log( 'league results here -xtra');
                                that.league__userScores = response.data.data['User'] || [];
                                that.league__list_top = response.data.data['UserList'] || [] ;

                                //get position for highlight

                                that.initChart();
    

                            } else {
                                // mock data
                               // display fetching teams UI
                            }
                    
                        } else {
                            console.log(
                             'no Results league TOP'   
                            );
                            that.league__list_self = [];
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        that.league__list_self = [];
                    })

            } catch (error) {
                console.info(error);
            }
        },

        /* get points by user API */
        getPointsByUser: function( type ) {

            var that = this;


            if ( type === 'top') {
                

                try {


                    // get points top users
                    axios.post('/getPointsByUser',
                        {
                            "UserName": that.userName,
                            "Type": "top"
                        }
                    )
                        .then(function(response) {
                            if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                                if( response.data.data) {
    
                                    console.log( 'league results here -TOp');
                                    that.league__userScores = response.data.data['User'] || [];
                                    that.league__list_top = response.data.data['UserList'] || [] ;

                                    //get position for highlight

                                    const { POS } = that.league__userScores;
                                    that.myPosition = POS;

                                    that.opentr( POS );

                                    that.initChart();
        
    
                                } else {
                                    // mock data
                                   // display fetching teams UI
                                }
                        
                            } else {
                                console.log(
                                 'no Results league TOP'   
                                );
                                that.league__list_self = [];
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                            that.league__list_self = [];
                        })
    
                } catch (error) {
                    console.info(error);
                }


            } else {


                try {


                    // get points top users
                    axios.post('/getPointsByUser',
                        {
                            "UserName": that.userName,
                            "Type": "self"
                        }
                    )
                        .then(function(response) {
                            if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                                if( response.data.data) {

                                 
                                    that.league__userScores = response.data.data['User'] || [];
                                    that.league__list_self = response.data.data['UserList'] || [] ;
                                    
                                    //get position for highlight

                                    const { POS } = that.league__userScores;
                                    that.myPosition = POS;

                                    that.opentr( POS );

                                    that.initChart();

    
                                } else {
                                    // mock data
                                   // display fetching teams UI
                                }
                        
                            } else {
                                console.log(
                                 'no Results league self'   
                                );
                                that.league__list_self = [];
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                            that.league__list_self = [];
                        })
    
                } catch (error) {
                    console.info(error);
                }


            }




        },


        /* get points by user end */


        





        /* 
        get match schedule for each group 
        */

        getSchedule: function () {
            
            var that = this;
            var finalData = {};

            that.playNow__prediction_form.UserName = that.userName;
            that.playNow__prediction_form.HostName = that.hostName;

            axios.post('/getSchedule', 
                { 'UserName': that.playNow__prediction_form.UserName || ''} 
                )
                .then(function(response) {

                    if (response.data.code === 200 && response.data.message === 'SUCCESS') {

                        finalData = response.data.data ;
                        
                        that.playNow__scheduleData = response.data.data[ that.playNow__selected_group ];
                        that.playNow__selected_groupId = response.data.data[ that.playNow__selected_group ][0].GroupId;

                        that.playNow__prediction_form.GroupId = that.playNow__selected_groupId;
                        

                        // assign match ID's for the formData to be used in prediction API
                        // get the saved Scores and edit when switching to other group


                            for ( var i = 0; i < that.playNow__scheduleData.length ; i++ ) {
                                

                                that.playNow__prediction_form.PredictorData[ i ]['GroupId'] = that.playNow__scheduleData[i]['GroupId'];
                                that.playNow__prediction_form.PredictorData[ i ]['MatchId'] = that.playNow__scheduleData[i]['MatchId'];

                                that.playNow__prediction_form.PredictorData[ i ]['TeamAResult'] = 
                                    that.playNow__scheduleData[i]['TeamAPrediction'] !== '?' 
                                    ? that.playNow__scheduleData[i]['TeamAPrediction'] 
                                    : '';

                                that.playNow__prediction_form.PredictorData[ i ]['TeamBResult'] =
                                    that.playNow__scheduleData[i]['TeamBPrediction'] !== '?' 
                                    ? that.playNow__scheduleData[i]['TeamBPrediction'] 
                                    : '';
                                    
                            };

                            that.checkFormInit();

                    } else {

                        // handling for expired token
                        // show modal to please refresh page to get new token
                        if(response.data.code === 20001) {
                            
                            alert('please refresh your page again to play');
                            
                        }
                    }

                })
                .catch(function(error) {
                    console.log(error);
                })

                

        },

        /* get match sched end */




        getLatestResult: function() {

            var that = this;

            try {
                axios.get('/getLatestResult')
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                            if( response.data.data) {
                                console.log( 'results here');
                                that.results_latestData = response.data.data;

                            } else {
                                // mock data
                               // display fetching teams UI
                            }
                    
                        } else {
                            console.log(
                             'no Results'   
                            );
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            } catch (error) {
                console.info(error);
            }


        },



        getAllResults: function() {

            var that = this;


            try {
                axios.get('/getResult')
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                            if( response.data.data) {
                                
                                that.results_allData = response.data.data;

                            } else {
                                // mock data
                               // display fetching teams UI
                            }
                    
                        } else {
                            console.log(
                             'no all Results'   
                            );
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            } catch (error) {
                console.info(error);
            }
        },



        
    getLang: function( lang ) {


        /* get and set languages */
        var that = this;
        let rand = Math.floor(1000000 + Math.random() * 900000);

        document.documentElement.setAttribute("lang", 'en');

        if( lang === 'eng') {
            $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20World%20Cup%20Predictor%20%5BPP-47%5D/languages/en.json', function(data) {
                that.languages = data;
            });
        } else if ( lang === 'ind' ) {
            $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v'  + rand + '/000%20World%20Cup%20Predictor%20%5BPP-47%5D/languages/id.json', function(data) {
                    that.languages = data;
            });
        } else if ( lang === 'vnm' ) {
            $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20World%20Cup%20Predictor%20%5BPP-47%5D/languages/vi.json', function(data) {
                    that.languages = data;
            });
            document.documentElement.setAttribute("lang", 'vi');
        } else if ( lang === 'tha' ) {
            $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20World%20Cup%20Predictor%20%5BPP-47%5D/languages/th.json', function(data) {
                    that.languages = data;
            });
        } else if ( lang === 'jpn' ) {
            $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20World%20Cup%20Predictor%20%5BPP-47%5D/languages/jp.json', function(data) {
                    that.languages = data;
            });
        } else {
            $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20World%20Cup%20Predictor%20%5BPP-47%5D/languages/en.json', function(data) {
                that.languages = data;
            });
        }

        return that.languages;
        

    },

        /* SEND THE PREDICTION */


        submitPrediction: function() {

            
            var that = this;

            that.isLoading = true;


            $('#myModal').fadeIn('slow');
            (function fun() {
                $('.modal-content').css({
                    'transform': 'translateY(150px)'
                });
            })();

            try {
                axios.post('/predict', 
                    that.playNow__prediction_form
                  )
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {

                            that.successPrediction = true;
                            that.showPredResults = true;
                            
                            that.isLoading = false;

                            // show You're in the game UI here


                            that.getSchedule();

                            /* if successful predict
                            ** lock all matches
                            ** show edit btn again for edit*/

                            that.editBtnShow = true;
                            that.submitBtnShow = false;
                            that.invalidForm = false;
                            // that.selectGroup( that.playNow__selected_group);

                            that.getPointsByUser('self');



                        } else {
                            console.log('prediction error');
                            that.errorPrediction = true;
                            that.errorMessage = response.data.message;

                            that.isLoading = false;

                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                        that.errorPrediction = true;
                    })
            } catch (error) {
                console.info(error);
                that.errorPrediction = true;
            }
        },

    },




    mounted() {
     
        
        const that = this;
        $('#close-modal').on("click", function() {
            that.hideModals();
        });

        that.showLeaderboards =  true;
        document.getElementById( 'leagueTableM' ).classList.add('active');

        $('ul.faq-menu li > ul').hide();


        try {
            setTimeout( function(){
                document.getElementById("clickP").addEventListener('click',function ()
                {
                    that.redirectToBonus();
                }); 
            },3000)
        } catch(err) {
            setTimeout( function(){
                document.getElementById("clickP").addEventListener('click',function ()
                {
                    that.redirectToBonus();
                }); 
            },1000)
        }
        
  
    },

    created() {
        
        const that = this;

        /* set language from URL Params */
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
          });
        let langVal = params.lang; 

        that.userName = params.jwt || 'lVLaa123432';
        that.hostName = params.host || 'https://happistar.org';


        that.getLang(langVal);


        that.getHowToPlay();
        that.getAllTeams(); 
        that.getLatestResult();
        that.getAllResults();
        //that.getPointsByUser( 'self' );
        that.getPointsExtra();
        this.showLeaderboards =  true;
        this.showHowtoPlay = false;

    }
});

/* The countdown */

    function CountdownTracker(label, value){

        var el = document.createElement('span');
    
        el.className = 'flip-clock__piece';
        el.innerHTML = '<span class="flip-clock__slot">' + label + '</span>' + '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>';
    
        this.el = el;
    
        var top = el.querySelector('.card__top'),
            bottom = el.querySelector('.card__bottom'),
            back = el.querySelector('.card__back'),
            backBottom = el.querySelector('.card__back .card__bottom');
    
        this.update = function(val){
        val = ( '0' + val ).slice(-2);
        if ( val !== this.currentValue ) {
            
            if ( this.currentValue >= 0 ) {
            back.setAttribute('data-value', this.currentValue);
            bottom.setAttribute('data-value', this.currentValue);
            }
            this.currentValue = val;
            top.innerText = this.currentValue;
            backBottom.setAttribute('data-value', this.currentValue);
    
            this.el.classList.remove('flip');
            void this.el.offsetWidth;
            this.el.classList.add('flip');
        }
        }
        
        this.update(value);
  }
  
  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    return {
      'Total': t,
      'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
      'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
      'Minutes': Math.floor((t / 1000 / 60) % 60),
      'Seconds': Math.floor((t / 1000) % 60)
    };
  }
  
  function Clock(countdown,callback) {
    
    countdown = countdown ? new Date(Date.parse(countdown)) : false;
    callback = callback || function(){};
    
    var updateFn = countdown ? getTimeRemaining : getTime;
  
    this.el = document.createElement('div');
    this.el.className = 'flip-clock';
  
    var trackers = {},
        t = updateFn(countdown),
        key, timeinterval;
  
    for ( key in t ){
      if ( key === 'Total' ) { continue; }
      trackers[key] = new CountdownTracker(key, t[key]);
      this.el.appendChild(trackers[key].el);
    }
  
    var i = 0;
    
    function updateClock() {
      timeinterval = requestAnimationFrame(updateClock);
      
      // throttle so it's not constantly updating the time.
      if ( i++ % 10 ) { return; }
      
      var t = updateFn(countdown);
      if ( t.Total < 0 ) {
        cancelAnimationFrame(timeinterval);
        for ( key in trackers ){
          trackers[key].update( 0 );
        }
        callback();
        return;
      }
      
      for ( key in trackers ){
        trackers[key].update( t[key] );
      }
    }
  
    setTimeout(updateClock,500);
  }
  
  var targetDate = new Date(localStorage.getItem('targetDate'));
  var dateNow = new Date();

  var difference = targetDate.getTime() - dateNow.getTime();

  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

  var deadline = new Date(Date.parse(new Date()) + TotalDays * 24 * 60 * 60 * 1000);



  var c = new Clock(deadline, function(){ console.log( 'countdown finished... ') });
  document.getElementById('countdown').appendChild(c.el); 
  

/* countdown end */

Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            //Get ctx from string
            var ctx = chart.chart.ctx;
            
            //Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Monsterrat';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
            //Start with a base font of 30px
            ctx.font = "40px " + fontStyle;
            
            //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight);

            //Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = "40px " + fontStyle;
            // ctx.font = fontSizeToUse + fontStyle;
            ctx.fillStyle = color;
            
            //Draw text in center
            ctx.fillText(txt, centerX, centerY);
        }
    }
});
