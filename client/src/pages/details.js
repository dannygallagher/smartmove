import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../Styles/details.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Image from '../Styles/city_warm.jpg';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

export default function Details() {
    
    const useStyles = makeStyles((theme) => ({
            root: {
                flexGrow: 1,
                padding: theme.spacing(2),
                backgroundImage: `url(${Image})`
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
                backgroundColor: "rgba(245,245,245,1)"
            },
            chart: {
              backgroundColor: "rgba(245,245,245,1)"

            },
            pieChart: {
              padding: theme.spacing(4),
              backgroundColor: "rgba(245,245,245,1)"

            },

            headings: {
              backgroundColor: "rgba(245,245,245,1)"
            }
        }));
    const classes = useStyles();
    
    // used to render the fetches
    useEffect(() => {
      fetchEthnic();
      fetchCategories();
      fetchGender();
      fetchLocalRest();
      fetchHomeValues();
      fetchRentPrices();
    }, []);

    // CREATE HOOK FOR ZIPCODE
    const [zip, setZip] = useState(85032);


    /* ---------  CREATE HOOKS FOR ALL CHARTS  -----------*/

    // bar chart data and options initialization
    const [barData, setBarData] = useState({});
    const [barOptions, setBarOptions] = useState({
      options: {
          legend: {
              display: false
          },
          scales: {
              yAxes: [
                  {
                      ticks: {
                          beginAtZero: true
                      }
                  }
              ]
          },
          tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
          }
      }
    });

    // pie chart of ethnicity data and options initialization
    const [pieData, setPieData] = useState({});
    const [pieOptions, setPieOptions] = useState({
        options: {}
    });

    // pie chart of genders data and options initialization
    const [genderPieData, setGenderPieData] = useState({});
    const [genderPieOptions, setGenderPieOptions] = useState({
        options: {}
    });

    // bar chart data and options initialization
    const [groupBarData, setGroupBarData] = useState({});
    const [groupBarOptions, setGroupBarOptions] = useState({
      options: {
          legend: {
              display: false
          },
          scales: {
              yAxes: [
                  {
                      ticks: {
                          beginAtZero: true
                      }
                  }
              ]
          },
          tooltips: {
            callbacks: {
               label: function(tooltipItem) {
                      return tooltipItem.yLabel;
               }
            }
          }
      }
    });

    // doughnut chart data and options initialization
    const [doughnutData, setDoughnutData] = useState({});
    const [doughnutOptions, setDoughnutOptions] = useState({
        options: {}
    });
    
    // line chart data and options initialization
    const [homeLineData, setHomeLineData] = useState({});
    const [rentLineData, setRentLineData] = useState({});
    const [lineOptions, setLineOptions] = useState({
      options: {
        scales: {
          yAxes: [
              {
                  ticks: {
                      beginAtZero: true
                  }
              }
          ]
        }
      }
    });

    /* -----------------  FETCH CATEGORIES DATA -------------------*/

    const fetchCategories = () => {
        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch(`http://localhost:4000/businessCategoriesBarChart/'${zip}'`, 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            // console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            // console.log(resultsList[0])
            var labels = [];
            var data = [];
            for(var i = 0; i < resultsList.length; i++) {
                labels.push(resultsList[i].category)
                data.push(resultsList[i].number_of_businesses)
            }
            setBarData({
              labels: labels,
              datasets: [
                  {   
                      label: '# Businesses',
                      // data: [1, 2, 3,4,5,6],
                      data: data,
                      backgroundColor: ['rgba(143, 164, 71, 0.6)'],
                      hoverOffset: 4
                  }
              ],
              legend: {
                display: false
              }
            });
        });
    };

    /*---------------------- FETCH GENDER INFO  -------------------------*/
    
    const fetchGender = () => {
        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch(`http://localhost:4000/genderPieChart/'${zip}'`, 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            // console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            // console.log(resultsList[0])
            setGenderPieData({
              labels: ['Female', 'Male'],
              datasets: [
                  {   
                      label: 'Gender',
                      // data: [1, 2, 3,4,5,6],
                      data: [
                        resultsList[0].Percent_Female, 
                        resultsList[0].Percent_Male
                      ],
                      backgroundColor: [
                        'rgba(255, 30, 30, 0.6)',
                        'rgba(20, 100, 235, 0.6)'
                      ],
                      hoverOffset: 4
                  }
              ]
            });
        });
    };
    
    /*---------------------- FETCH ETHNICITY  -------------------------*/

    const fetchEthnic = () => {
        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch(`http://localhost:4000/ethnicPieChart/'${zip}'`, 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            // console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            // console.log(resultsList[0])
            setDoughnutData({
              labels: Object.keys(resultsList[0]),
              datasets: [
                  {   
                      label: 'Ethnicity',
                      // data: [1, 2, 3,4,5,6],
                      data: [
                        resultsList[0].Asian, 
                        resultsList[0].Black, 
                        resultsList[0].AmericanIndian, 
                        resultsList[0].NativeHawaiianOtherPacific, 
                        resultsList[0].White, 
                        resultsList[0].TwoOrMoreRaces
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 144, 71, 0.6)',
                        'rgba(143, 164, 71, 0.6)'
                      ],
                      hoverOffset: 4
                  }
              ]
            });
        });
    };

    /*---------------------- FETCH LOCAL RESTAURANT LIST -------------------------*/
    
    const[restData, setRestData] = useState([]); //Hook for updating state of some specific results
    const fetchLocalRest = () => {
        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch(`http://localhost:4000/restaurants/${zip}`, 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            //console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            const resultsDivs = resultsList.map((result, i) => 
                <div className="restaurant">
                    <div className="name">{result.name}</div>
                    <div className="rating">{result.stars}</div>
                </div>
            )
            console.log(resultsList);
            setRestData(resultsDivs);
        });
    };
    
    /*---------------------- FETCH HOME VALUES -------------------------*/

    
    const fetchHomeValues = () => {
        // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
        fetch(`http://localhost:4000/homeValues/${zip}`, 
        {
            method: 'GET', // The type of HTTP request
        }).then(res => {
            // console.log(res.json());
            return res.json();
        }).catch((err) => {
            console.log(err)
        }).then(resultsList => {
            var row = resultsList[0];
            setHomeLineData({
              labels: Object.keys(row),
              datasets: [
                  {   
                      label: 'Average Home Value in US Dollars in Last 6 Months',
                      data: [
                        row.September, 
                        row.October,
                        row.November,
                        row.December,
                        row.January,
                        row.February
                      ],
                      backgroundColor: 'rgba(75,192,192, 0.2)',
                      borderColor: 'rgba(75,192,192,1)',
                      fill: true,
                      hoverOffset: 4
                  }
              ]
            });
        });
    };

    /*---------------------- FETCH RENT PRICES -------------------------*/

    const fetchRentPrices = () => {
      // Send an HTTP request to the server to pull the information for businesses from Phoenix, AZ
      fetch(`http://localhost:4000/rentPrices/${zip}`, 
      {
          method: 'GET', // The type of HTTP request
      }).then(res => {
          // console.log(res.json());
          return res.json();
      }).catch((err) => {
          console.log(err)
      }).then(resultsList => {
          var row = resultsList[0];
          setRentLineData({
            labels: Object.keys(row),
              datasets: [
                  {   
                      label: 'Average Rent Price in US Dollars in Last 6 Months',
                      data: [
                        row.September, 
                        row.October,
                        row.November,
                        row.December,
                        row.January,
                        row.February
                      ],
                      backgroundColor: 'rgba(116,39,116, 0.2)',
                      borderColor: 'rgba(116,39,116, 1)',
                      fill: true,
                      hoverOffset: 4
                  }
              ]
          });
      });
  };




    return (
        <div className={classes.root}>
          <div className="details-header">
            <div className="title"><strong>Zipcode: {zip}</strong></div>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    <div className={classes.chart}>
                        <Doughnut data={doughnutData} options={doughnutOptions.options} />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    <div className={classes.pieChart}>
                        <Pie data={genderPieData} options={genderPieOptions.options} />
                    </div>
                  </Paper>
                </Grid>
              </Grid> 
            </Grid>
            <Grid item xs={5}>
              <Grid container direction="column" spacing={3}>
                <Grid item xs>
                  <Paper className={classes.paper}> 
                    <div className={classes.chart}>
                        <Bar data={barData} options={barOptions.options} />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}>
                    <div className={classes.chart}>
                        <Line data={homeLineData} options={lineOptions.options} />
                    </div>
                  </Paper>                  
                </Grid>
                <Grid item xs>
                  <Paper className={classes.paper}> 
                    <div className={classes.chart}>
                        <Line data={rentLineData} options={lineOptions.options} />
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <Paper className={classes.headings}>
                <div className="restaurants-header">
                  <div className="header-lg"><strong>Top 15 Local Restaurant</strong></div>
                  <div className="header"><strong>Rating</strong></div>
                </div>
                <div className="results-container">
                  {restData}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </div>
    );
}