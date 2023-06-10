// global
Vue.use(window.vuelidate.default);

// local mixin
var validationMixin = window.vuelidate.validationMixin;
const {
    required,
    minLength, 
    maxLength,
} = window.validators;

axios.defaults.baseURL = apiUrl;

// update to production by Jason 
//axios.defaults.baseURL = 'https://wcp-api-9vdx2j890nvg.happistar.info';

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
            "PredictorData": []
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
        cancelButtonShow: false,
        completePrediction: false,
        predictionsMade: 0,
        noShowBtn: false,

        cd_days: '',
        cd_hours: '',
        cd_minutes: '',
        cd_seconds: '',


        remainForPredict: -1,
        remainGamesGlobal: 0,
        showNextGame: false,
        isScheduleDataLoaded: false,
        showZeroChart: false,

        processing: false


        

    },
    validations: {
        
        
        playNow__prediction_form: {
            PredictorData: {
                $each: {
                    TeamAResult: 
                        { required },
                    TeamBResult: 
                        { required }
                }
            }
        }
    },

    methods: {
        
        /* filter to display done and upcoming matches */

        filterMatches: function(type) {

            // when user clicks on the upcoming matches,
            // show only the matches with status 'null'
            // hide anything else; Vice-versa

            //step 1
            //get the matches
            var list;
            list = document.querySelectorAll(".match-item");

            // style highlight for the active tab
            if(type==="upcoming") {
                document.querySelector('.next').classList.add('active');
                document.querySelector('.prev').classList.remove('active');
            } else {
                document.querySelector('.next').classList.remove('active');
                document.querySelector('.prev').classList.add('active');
            }

            for (var i = 0; i < list.length; ++i) {

                list[i].classList.remove('show');
                list[i].classList.remove('hide');
                
                //step 2
                //apply hide/show classes if matches are upcoming or done
                // reference by `status` object
                if(type==='upcoming') {
                    if(list[i].classList.contains('upcoming')) {
                        list[i].classList.add('show');
                    } else {
                        list[i].classList.add('hide');
                    }
                } else {
                    if(list[i].classList.contains('done')) {
                        list[i].classList.add('show');
                    } else {
                        list[i].classList.add('hide');
                    }
                }

            }
            

        },



        /* we have 70 teams in playnow so, generate 70 objects for playnow */
        generateAllTeams: function() {

            var that = this;

            let myArray = [];

            for (let i = 0; i < 70; i++) {
                let obj = {
                    "GroupId": i,
                    "MatchId": i,
                    "TeamAResult": "",
                    "TeamBResult": "",
                    "WinningTeam": ""
                }
                    myArray.push(obj);
            }

            that.playNow__prediction_form = {
                "UserName": "testName",
                "GroupId": 1,
                "PredictorData": myArray
            }

        },  


        
        submitPrediction: function( index, teamSelected, position ) {

            //*** Step 1 - Make the Prediction
            // create a form body 
            // pass the form
            // handle the api response

            var that = this;


            // terminate the function
            // if an async request is processing
            if (that.processing === true) {
                return;
            } 

            // set the async state
            that.processing = true;

            try {
                axios.post('/predictIPL', 
                        {
                            "UserName": that.userName,
                            "GroupId": 1,
                            "PredictorData": [
                            {
                                "MatchId": index+1,
                                "GroupId": 1,
                                "TeamAResult": position==='left' ? 1 : 0,
                                "TeamBResult": position==='right' ? 1 : 0
                            }
                            ],
                            "HostName": that.hostName
                        }
                    )
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {

                            // that.successPrediction = true;
                            // that.showPredResults = true;
                            

                            //*** Step 2 - UI changes

                            // select the parent element
                            // get all the child elements
                            // loop the child elements
                            // set the clicked child element, add 'active' class
                            // set the text of the active element class to WIN, the other LOSE
                            
                            const parentEl = document.querySelector('#match_toggle_' + index);
                            let childEl = parentEl.querySelectorAll('.child')
                            

                            for( var i=0; i<childEl.length; i++) {
                                if(childEl[i]['id']=== teamSelected ) {
                                    document.getElementById( teamSelected ).classList.add('active');
                                    childEl[i]['innerHTML'] = 'WIN';
                                } else {
                                    document.getElementById( childEl[i]['id'] ).classList.remove('active');
                                    document.getElementById( childEl[i]['id'] ).classList.add('disabled');
                                    childEl[i]['innerHTML'] = 'LOSE';
                                }
                            }


                            // Step 3 - Handle Your'e in the Game screen
                            // if not predicted games is 0, show the screen
                            let { NotPredicted } = response.data.data;
                            that.remainForPredict = NotPredicted; 

                            
                            // Step 4 - Lock match after prediction
                            //if successful predict
                            // lock the selected match
                            
                            document.getElementById('matchParent_' + index).classList.add('disabled');
                            

                            // Step 5
                            // get the latest results of the match and leaderboards
                            that.getPointsByUser('self');
                            that.isLoading = false;
                            that.getSchedule();

                            // Step 6 
                            // if gamesRemain is 0, show Youre in the next game window
                            that.showNextGame = response.data.data.NotPredicted===0? true : false;

                            that.processing = false;


                        } else {
                            console.log('prediction error');
                            that.errorPrediction = true;
                            that.errorMessage = response.data.message;

                            that.isLoading = false;
                            that.processing = false;

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


        /* fix for Setting Switch text win or lose on load */
        setSwitchText: function() {

            // Start the timer
            const startTime = performance.now();
            
            // Your function code goes here
            // ...
            let parentEl = [];
            parentEl = document.querySelectorAll('div[id*="match_toggle_"]');
            
            parentEl.forEach(parent => {
                let childEl = parent.querySelectorAll('.child');
                childEl.forEach(child => {
                    if(child.classList.contains('active')) {
                        child['innerHTML'] = 'WIN';
                    } else {
                        child['innerHTML'] = 'LOSE';
                    }
                });
                return true;
            });


            // End the timer
            const endTime = performance.now();
            
            // Calculate the time elapsed in milliseconds
            const elapsedTime = endTime - startTime;
            
            // Log the elapsed time to the console
            console.log(`Function execution time: ${elapsedTime} milliseconds`);

        },


        lockMatch: function(el, teamA, teamB) {
            // to lock the matches that already has a prediction from the API
            if(teamA!=='?' && teamB!=='?') {
                document.getElementById(el).classList.add('disabled');
            } else {
                document.getElementById(el).classList.remove('disabled');
            }
        },


        unlockMatch: function(el) {
            document.getElementById(el).classList.remove('disabled');
        },

        changeToUnlockIcon: function(el) {
            document.getElementById(el).querySelector('i').classList.remove('fa-lock');
            document.getElementById(el).querySelector('i').classList.add('fa-unlock');
        },

        changeToLockIcon: function(el) {
            document.getElementById(el).querySelector('i').classList.remove('fa-unlock');
            document.getElementById(el).querySelector('i').classList.add('fa-lock');
        },






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
                    const currTR = parentEl[0].closest('tr');
                }
             });

        },





        // checkFormInit() {

        //     var that = this;
    


        //     /* get prediction datas here init*/
        //     for ( var i= 0; i < this.playNow__scheduleData.length; i++ ) {
        //         if( (this.playNow__scheduleData[i].TeamAPrediction === '?' ||
        //         this.playNow__scheduleData[i].TeamBPrediction === '?') && this.playNow__scheduleData[i].Status!==-1 ) {
        //             // fix for -1 -1 
        //             console.log('call init');
        //             this.invalidForm = true;
        //         } 
        //     }


        //     /* don't show any buttons if all match have
        //     status Values */
            
        //     var ctr = 0;
        //     for ( var i= 0; i < this.playNow__scheduleData.length; i++ ) {
        //         if (this.playNow__scheduleData[i].Status === 1 ||
        //             this.playNow__scheduleData[i].Status === 0 ||
        //             this.playNow__scheduleData[i].Status === 3 ||
        //             this.playNow__scheduleData[i].Status === -1 ||
        //             this.playNow__scheduleData[i].Status === -2) {
        //                 ctr++;
        //         } 
        //     }

        //     console.log(ctr, ' all match done');
        //     if (ctr === 4) {
        //         that.noShowBtn = true;
        //     }
    
        // },

        checkCompleteMatches: function() {

            var that = this;

            // for every switch page, check if the matches are complete
            // if the matches are complete then set completePrediction = true
            
            
            that.completePrediction = true;



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

            return this.convertTime( new Date( date ).toLocaleString('en-US', { timeZone: clientTimeZone }));
            
        },


        switchPage: function( page ) {

            var that = this;

            that.showNextGame = false;

            // try {
            //     $('.lr-carousel').slick('unslick');
            // } catch(err) {
            //     console.log('error', err);
            // }

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
                 document.getElementById( 'prizesM' ).classList.remove('activex');
                
                setTimeout(function() {
                    $( "#clickP" ).on( "click", function() {
                      that.switchPage(2);
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
                document.getElementById( 'prizesM' ).classList.remove('activex');

                setTimeout( function(){

                    $(".triggerClick").click();
                    
                    that.setSwitchText();
                }, 1500);


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
                 document.getElementById( 'prizesM' ).classList.remove('activex');

                  
                  
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
                 document.getElementById( 'prizesM' ).classList.remove('activex');


                 that.selectResultByGroup('A');

                setTimeout( function(){
            
                    /* for highlight */
                    $('.group-nav__wrap li').click(function(){
                
                        console.log( 'clicked 2');
                        $('.active').removeClass('active');
                        $(this).addClass('active');
                    
                    });
                
                }, 1500);
                

                 // display in carousel mode 
                // try {
                //     $(document).ready(function(){
                //         $('.lr-carousel').slick({
                //             slidesToShow: 2,
                //             infinite: true,
                //             dots: false,
                //             centerMode: true,
                //             autoplay: true,
                //             autoplaySpeed: 2000,
                //             responsive: [
                //                 {
                //                   breakpoint: 867,
                //                   settings: {
                //                     slidesToShow: 1,
                //                     slidesToScroll: 1,
                //                     infinite: true,
                //                   }
                //                 }
                //               ]
                //         });
                //     });
                // } catch(err) {
                //     console.info('cannot find target');
                // }

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
                 document.getElementById( 'prizesM' ).classList.add('activex');

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
            

            var that = this;

            var redLink = '';
            
            if(that.isMobile() === true ) {
                redLink = `https://${that.hostName}/sports/pre-match/event-view/Cricket/India/10851?specialSection=popular-competitions`; 
            } else {
                let desktopDomain = (new URL(that.hostName));
                redLink = `https://${desktopDomain.hostname}/#/sport/?type=0&sport=1&menuType=0&popularCompetition=10851`;
                console.log(desktopDomain, desktopDomain.hostname);
            }

            
            setTimeout(function(){
                console.log(redLink);
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




        /* ==================
        
        REST functions 
        
        ===================== */


        /* 
            GET Info for How to Play page
         */


        getHowToPlay: function() {
            var that = this;
            try {
                axios.post('/getHowToPlayIPL', 
                    {
                        "Device": that.isMobile() === true ? 'Mobile' : 'Desktop',
                        "Lang": "EN"
                    })
                    .then(function(response) {
                        if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                            that.howToPlayData = response.data.data;
                            localStorage.setItem('targetDate', that.howToPlayData.WcpStartTime );
                            that.initCountdown();
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
                axios.get('/getTeamsIPL')
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

            // v53
            that.noShowBtn = false;

            that.invalidForm = false;
            that.successPrediction = false;

            that.playNow__group_competitors = that.playNow__group_teamsData[ group ];

            // set text for selected group
            that.playNow__selected_group = group;

            that.getSchedule();

            that.editBtnShow = true;
            that.cancelButtonShow = false;
            that.submitBtnShow = false;

            // add highlight
            $('.group-nav__wrap li').removeClass('active');
            setTimeout( function() {
                $( '#g_' + group ).addClass('active');
            }, 300)
            


            // disable all prediction box 

            for( var i=0; i< $(".score").children('input').length; i++ ) {
                
                if( $(".score").children('input')[i]._value !== '' || $(".score").children('input')[i]._value !== -1 ) {
                    $(".score").children('input')[i].disabled = true;

                }

            }

            
            var unpredictedItems = 0;
            for( var i=0; i< $(".score").children('input').length; i++ ) {
                

                if( $(".score").children('input')[i]._value === '' ||  $(".score").children('input')[i]._value === '?' || $(".score").children('input')[i]._value === -1 ) {
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








        /* skip to next group after done 
        with prediction */
        
        gotoNextPage: function( groupname ) {

            var that = this;
            
            switch(groupname) {
                case 'A' :
                    that.selectGroup( 'B' );        
                    break;
                case 'B' :
                    that.selectGroup( 'C' );
                    break;
                case 'C' :
                    that.selectGroup( 'D' );
                    break;
                case 'D' :
                    that.selectGroup( 'E' );
                    break;
                case 'E' :
                    that.selectGroup( 'F' );
                    break;
                case 'F' :
                    that.selectGroup( 'G' );
                    break;
                case 'G' :
                    that.selectGroup( 'H' );
                    break;
                case 'H' :
                    that.selectGroup( 'A' );
                    break;
                default:

            }

        },





        selectResultByGroup: function( group ) {

            var that = this;

            that.results_allDataUi = that.results_allData[ group ];

        },







         /* countdown functions */

         checkSingleDigit: function( val ) {
            var valAsString = val.toString();
            if (valAsString.length === 1) {
                return true;
            }
            return false;
        },

        tensOnes: function(get, num) {
            
            let tens = Math.floor(num / 10);
            let ones = num % 10;

            if(get==='tens') {
                return tens;
            } else {  
                return ones;
            }

        },


        // function for generating the countdown
        initCountdown: function() {

            var that = this;
            var eventTime, currentTime, duration, interval, intervalId;

                interval = 1000; // 1 second

            // get time element
            // calculate difference between two times
            // Fri, 31 Mar 2023 15:50:00 GMT

            eventTime = moment.tz(that.howToPlayData.WcpStartTime !== null ? that.howToPlayData.WcpStartTime : 'Fri, 31 Mar 2023 15:50:00 GMT', "Asia/Kolkata");
            // based on time set in user's computer time / OS
            currentTime = moment.utc();
            // get duration between two times
            duration = moment.duration(eventTime.diff(currentTime));

            // loop to countdown every 1 second
            setInterval(function() {
                // get updated duration
                duration = moment.duration(duration - interval, 'milliseconds');

                // if duration is >= 0 (Phase 2)
                if (duration.asSeconds() <= 0) {
                    clearInterval(intervalId);
                    // hide the countdown elements
                    $('.tickers-container').hide();
                    $('.countdown').hide();
                } else {
                    // otherwise, show the updated countdown
                    
                    that.cd_days = duration.days();
                    that.cd_hours = duration.hours();
                    that.cd_minutes = duration.minutes();
                    that.cd_seconds = duration.seconds();

                    // document.getElementById("days").innerText = that.checkSingleDigit(that.cd_days) === false ? that.cd_days : '0' + that.cd_days;
                    // document.getElementById("hours").innerText = that.checkSingleDigit(that.cd_hours) === false ? that.cd_hours : '0' + that.cd_hours;
                    // document.getElementById("minutes").innerText = that.checkSingleDigit(that.cd_minutes) === false ? that.cd_minutes : '0' + that.cd_minutes;
                    // document.getElementById("seconds").innerText = that.checkSingleDigit(that.cd_seconds) === false ? that.cd_seconds : '0' + that.cd_seconds;

                }
                }, interval);

        },




        // function for generating the charts in leaderboards
        initChart: function() {

            var that = this;
            // show donut chart League Points
            
            var { 
                GamesPlayed,
                CorrectResult,
                TotalPoints,
                }  = that.league__userScores;
            
            GamesPlayed = GamesPlayed || 0;
            CorrectResult = CorrectResult || 0;
            TotalPoints = TotalPoints || 0;
            var remainingGames = that.remainGamesGlobal || 0;

            
            var cData = [
                        { 
                            "a1" : Math.round(( GamesPlayed  / 70 ) * 70),
                            "a2": Math.round(70 - (( GamesPlayed  / 70 ) * 70))
                        },
                        { 
                            "a1" : Math.round(( GamesPlayed  / 70 ) * 70),
                            "a2": Math.round(70 - (( GamesPlayed  / 70 ) * 70))
                        },
                        {
                            "a1" : Math.round(( remainingGames  / 70 ) * 70),
                            "a2": 70 - Math.round((( remainingGames  / 70) * 70))
                        },
                        {
                            "a1" : Math.round(( CorrectResult  / 70 ) * 70),
                            "a2": Math.round(70 - (( CorrectResult  / 70 ) * 70))
                        },
                        {
                            "a1" : Math.round(( TotalPoints   / 70 ) * 70),
                            "a2": Math.round(70 - (( TotalPoints   / 70 ) * 70))
                        }
                    ]
            
            
                    console.log(
                        cData
                    )

                    
            for ( var i=0; i < cData.length; i++ ) {
                that.generateChart( i >1 ? i : '', cData[i] );
            }


        },


        
        /* get points by user API */
        getPointsByUser: function( type ) {

            var that = this;


            if ( type === 'top') {
                

                try {


                    // get points top users
                    axios.post('/getPointsByUserIPL',
                        {
                            "UserName": that.userName,
                            "Type": "top"
                        }
                    )
                        .then(function(response) {
                            if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                                if( response.data.data) {
    
                                    console.log( 'league results here -TOp');
                                    that.remainGamesGlobal = response.data.data.GamesRemain || 0;
                                    that.league__userScores = response.data.data['User'] || response.data.data;
                                    that.league__list_top = response.data.data['UserList'] || [] ;

                                    that.predictionsMade = response.data.data['User'].GamesPlayed || 0;
                                    

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
                            that.league__userScores = {
                                GamesPlayed: 0,
                                CorrectResult: 0,
                                TotalPoints: 0,
                            }
                            that.initChart();
                        })
    
                } catch (error) {
                    console.info(error);
                    that.initChart();
                }


            } else {


                try {


                    // get points top users
                    axios.post('/getPointsByUserIPL',
                        {
                            "UserName": that.userName,
                            "Type": "self"
                        }
                    )
                        .then(function(response) {
                            if (response.data.code === 200 && response.data.message === 'SUCCESS') {
                                if( response.data.data) {

                                    that.remainGamesGlobal = response.data.data.GamesRemain || 0;
                                    that.league__userScores = response.data.data['User'] || response.data.data;
                                    that.league__list_self = response.data.data['UserList'] || [] ;

                                    that.predictionsMade = response.data.data['User'].GamesPlayed;
                                    
                                    
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
                                that.league__userScores = {
                                    GamesPlayed: 0,
                                    CorrectResult: 0,
                                    TotalPoints: 0,
                                }
                                that.initChart();
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                            that.league__list_self = [];
                            that.league__userScores = {
                                GamesPlayed: 0,
                                CorrectResult: 0,
                                TotalPoints: 0,
                            }
                            that.initChart();
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

            that.playNow__prediction_form.UserName = that.userName;
            that.playNow__prediction_form.HostName = that.hostName;

            axios.post('/getScheduleIPL', 
                { 'UserName': that.playNow__prediction_form.UserName || ''} 
                )
                .then(function(response) {

                    if (response.data.code === 200 && response.data.message === 'SUCCESS') {

                        setTimeout( function() {
                            that.isScheduleDataLoaded = true;
                        },500);


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
                    that.isScheduleDataLoaded = false;
                })

                

        },



        
        /* get match sched end */




        getLang: function( lang ) {


            /* get and set languages */
            var that = this;
            let rand = Math.floor(1000000 + Math.random() * 900000);

            document.documentElement.setAttribute("lang", 'en');

            if( lang === 'eng') {
                
                $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20IPL%20Front-end/languages/en.json', function(data) {
                    that.languages = data;
                    document.title = `Happistar ${ that.languages?.worldCupPredictor }`;
                });
            } else if ( lang === 'ind' ) {
                $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v'  + rand + '/000%20IPL%20Front-end/languages/id.json', function(data) {
                        that.languages = data;
                        document.title = `Happistar ${ that.languages?.worldCupPredictor }`;
                });
            } else if ( lang === 'vnm' ) {
                $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20IPL%20Front-end/languages/vi.json', function(data) {
                        that.languages = data;
                        document.title = `Happistar ${ that.languages?.worldCupPredictor }`;
                });
                document.documentElement.setAttribute("lang", 'vi');
            } else if ( lang === 'tha' ) {
                $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20IPL%20Front-end/languages/th.json', function(data) {
                        that.languages = data;
                        document.title = `Happistar ${ that.languages?.worldCupPredictor }`;
                });
            } else if ( lang === 'jpn' ) {
                $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20IPL%20Front-end/languages/jp.json', function(data) {
                        that.languages = data;
                        document.title = `Happistar ${ that.languages?.worldCupPredictor }`;
                });
            } else {
                $.getJSON('https://res.cloudinary.com/blackbox/raw/upload/v' + rand + '/000%20IPL%20Front-end/languages/en.json', function(data) {
                    that.languages = data;
                    document.title = `Happistar ${ that.languages?.worldCupPredictor }`;
                });
            }
            
            

        }

    },



    mounted() {
     
        
        const that = this;
        $('#close-modal').on("click", function() {
            that.hideModals();
        });

        that.showPlayNow =  true;
        document.getElementById( 'playNowM' ).classList.add('activex');

        $('ul.faq-menu li > ul').hide();


        try {
            setTimeout( function(){
                document.getElementById("clickP").addEventListener('click',function ()
                {
                    that.switchPage(2);
                }); 
            },3000)
        } catch(err) {
            console.log(("%c"+ err), "style: yellow; background: black;")
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

        that.generateAllTeams();
        that.getLang(langVal);
        that.getHowToPlay();
        that.getAllTeams(); 
        //that.getLatestResult();
        //that.getAllResults();
        that.getPointsByUser( 'self' );
        setTimeout( function() {
            that.initCountdown();
            that.switchPage(2);
        }, 500)


    
    },

    computed: {
        playNow__group_competitors() {
          return this.items.sort((a, b) => a.PTS - b.PTS)
        }
    }

});

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
