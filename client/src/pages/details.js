import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../Styles/details.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

export default function Details() {
    
    const useStyles = makeStyles((theme) => ({
            root: {
                flexGrow: 1,
                padding: theme.spacing(2),
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
            },
            chart: {

            },
            headings: {
            }
        }));
    const classes = useStyles();
    
    // used to render the fetches
    useEffect(() => {
      fetchEthnic();
      fetchCategories();
      fetchGender();
      fetchLocalRest();
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
    const [lineData, setLineData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "First dataset",
            data: [33, 53, 85, 41, 44, 65],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
          {
            label: "Second dataset",
            data: [33, 25, 35, 51, 54, 76],
            fill: false,
            borderColor: "#742774"
          }
          
        ],
        legend: {
          display: false
        }
    });
    const [lineOptions, setLineOptions] = useState({
      options: {}
    });

    /* ---------  FETCH DATA FOR ALL GRAPHS -----------*/

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
    

    return (
        <div className={classes.root}>
          <Grid container spacing={1}>  
            <Grid item xs>
              <Paper className={classes.paper}>Zipcode: {zip}</Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <div className={classes.chart}>
                    <Doughnut data={doughnutData} options={doughnutOptions.options} />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}> 
                <div className={classes.chart}>
                    <Bar data={barData} options={barOptions.options} />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <div className={classes.chart}>
                    <Pie data={genderPieData} options={genderPieOptions.options} />
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs>
              <Paper className={classes.heading}>
                <div className="restaurants-header">
                  <div className="header-lg"><strong>Top 10 Local Restaurant</strong></div>
                  <div className="header"><strong>Rating</strong></div>
                </div>
                <div className="results-container">
                  {restData}
                </div>
              </Paper>
            </Grid>
            {/* <Grid item xs={4}>
              <Paper className={classes.paper}>
                <div className={classes.chart}>
                    <Line data={lineData} />
                </div>
              </Paper>
            </Grid> */}
            
          </Grid>
        </div>
      );
}