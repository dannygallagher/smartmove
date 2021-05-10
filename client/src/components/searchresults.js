import * as React from 'react';
import '../Styles/SearchResults.css';

export const SearchResultsHeader = ({zipOrBusiness, resultFieldsZip}) => {

    return(
        <div className="results-header-container">
            {zipOrBusiness === "zip" &&
                <>
                    <div className="results-header"><strong>Zip Code</strong></div> 
                    <div className="results-header"><strong>City</strong></div> 
                    <div className="results-header"><strong>State</strong></div> 
                    <div className="results-header"><strong>County</strong></div> 
                    <div className="results-header"><strong>Median House Value</strong></div>
                    <div className="results-header"><strong>Avg Business Rating</strong></div>
                    <div className="results-header"><strong>More Details</strong></div>
                </>
            }
            {zipOrBusiness === "business" &&
                <>
                    <div className="results-header"><strong>Name</strong></div> 
                    <div className="results-header"><strong>Zip Code</strong></div> 
                    <div className="results-header"><strong>City</strong></div> 
                    <div className="results-header"><strong>State</strong></div> 
                    <div className="results-header"><strong>Rating</strong></div>
                </>
            }
        </div>
    )
}


export const SearchResultsRow = ({ zipOrBusiness, output, setShowDetails, setZip }) => {

    const detailsButtonHandler = () => {
        setZip(output.zip);
        setShowDetails(true);
    }

    return(
        <div className="results-container">
            {zipOrBusiness === "zip" &&
                <>
                    <div className="results">{output.zip}</div> 
                    <div className="results">{output.city}</div> 
                    <div className="results">{output.state}</div> 
                    <div className="results">{output.county}</div> 
                    <div className="results">{output.MedianHomeValue}</div>
                    <div className="results">{output.avgBusinessRating}</div>
                    <div className="results" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <button onClick={detailsButtonHandler}>Details</button>
                    </div>
                </>
            }
            {zipOrBusiness === "business" &&
                <>
                    <div className="results">{output.name}</div> 
                    <div className="results">{output.zip}</div> 
                    <div className="results">{output.city}</div> 
                    <div className="results">{output.state}</div> 
                    {output.county ? <div className="results">{output.county}</div> : <></>}
                    <div className="results">{output.rating}</div> 
                </>
            }
        </div>
    )
}

