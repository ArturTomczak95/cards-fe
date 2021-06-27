import React,{Component} from 'react';
import {Table, Button, Row} from 'react-bootstrap';
require('dotenv').config()

export class Cards extends Component {

    constructor(props) {
        super(props);
        this.state={cards:[], FirstName:"", LastName: "", OrganizationName:"", Type:"", isAddCardClicked: false, isLastNameEditMode: false, indexUnderEdition: null}
    }

    getCards() {
        fetch(process.env.REACT_APP_API_URL + "/cards")
        .then(response => response.json())
        .then(data => {
            this.setState({cards:data})
        });
    }

    onCardAddClick(show) {
        this.setState({isAddCardClicked: show});
    }

    onCardDeleteClick(event, cardId) {
        if (!cardId) {
            alert("card id cannot be empty");
        }

        event.preventDefault();
        fetch(process.env.REACT_APP_API_URL + `/card/${cardId}`,{
            method:'DELETE',
        })
        .then(res => res.json())
        .then((result) => {
            if(result.Status === 200) {
                this.getCards();
            } else {
                alert(`Failed to delete item: ${result.Message}`);
            }
            },
            (error) => {
                alert(`Failed to delete item: ${error}`);
            }
        );
    }

    componentDidMount() {
        this.getCards();
    }

    handleFirstNameChange(event) {
        this.setState({FirstName: event.target.value});
    }

    handleLastNameChange(event) {
        this.setState({LastName: event.target.value});
    }

    handleOrganizationNameChange(event) {
        this.setState({OrganizationName: event.target.value});
    }

    handleTypeChange(event) {
        this.setState({Type: event.target.value});
    }

    onSaveCardClick(event) {
        if (!this.state.FirstName || !this.state.FirstName.trim() || !this.state.FirstName || !this.state.FirstName.trim() 
        || !this.state.OrganizationName || !this.state.OrganizationName.trim() || !this.state.Type || !this.state.Type.trim()) {
            alert("At least one of the fields is empty: First Name, Last Name, Organization Name, Type cannot be empty.")
            return;
        }

        event.preventDefault();
        fetch(process.env.REACT_APP_API_URL + "/card",{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "FirstName": this.state.FirstName,
                "LastName": this.state.FirstName,
                "OrganizationName": this.state.OrganizationName,
                "Type": this.state.Type
            })
        })
        .then(res => res.json())
        .then((result) => {
            if (result.Status === 200) {
                this.getCards();
                this.onCardAddClick(false);
                this.resetFields();
            } else {
                alert(`An error during saving occurred. ${result.Message}`)
            }
            },
            (error) => {
                alert("An error during submiting request occured.");
            }
        );
    }

    resetFields() {
        this.setState({FirstName: ""});
        this.setState({LastName: ""});
        this.setState({OrganizationName: ""});
        this.setState({Type: ""});
    }

    onCardUpdateClick(event, cardIndex, userCardId) {
        if (!this.state.cards[cardIndex] || !this.state.cards[cardIndex].LastName.trim()) {
            alert("User Name cannot be empty")
            return;
        }

        event.preventDefault();
        fetch(process.env.REACT_APP_API_URL + `/card/${userCardId}`,{
            method:'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "LastName": this.state.cards[cardIndex].LastName
            })
        })
        .then(res => res.json())
        .then((result) => {
                this.getCards();
                this.onCardEditClick(false, null);
                this.resetFields();
            },
            (error) => {
                alert("An error during submiting request occured.");
            }
        );
    }

    onCardEditClick(show, index) {
        this.setState({isLastNameEditMode: show});
        this.setState({indexUnderEdition: index})
    }

    handleLastNameChangeUpdate(event, index) {
        let cards = [...this.state.cards];
        let card = {...cards[index]};
        card.LastName = event.target.value;
        cards[index] = card;
        this.setState({cards});
    }

    render() {
        const {cards, FirstName, LastName, OrganizationName, Type, isAddCardClicked, isLastNameEditMode, indexUnderEdition}=this.state;
        let cardIndex = cards.length + 1;
        return (
            <div class="cards-wrapper sm ml mr m-5 mt-4">
                <Row>
                    <div style={{"width": "100%"}}>
                        <Button variant="success" style={{"float": "right"}} onClick={() => this.onCardAddClick(true)}>Add Card</Button>
                    </div>
                </Row>
                <Row>
                    {/* /TODO: styles to class, mediatype */}
                    <div className="mt-3 d-flex justify-content-left width-100" style={{"overflowX":"auto", "overflowY": "hidden", "width":"100%"}}> 
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Card Number</th>
                                    <th>Valid Thru</th>
                                    <th>Organization Name</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card, index) =>
                                        <tr key={card.UserCardId}>
                                            <td>{index + 1}</td>
                                            <td>{card.FirstName}</td>
                                            <td>
                                                {isLastNameEditMode && indexUnderEdition === index ? 
                                                    <input type="text" id="LastName" value={this.state.cards[index].LastName} onChange={(e) => this.handleLastNameChangeUpdate(e, index)} name="FirstName"/>
                                                    : card.LastName} 
                                                {isLastNameEditMode && indexUnderEdition === index ? 
                                                    <Button variant="success" style={{"float": "right"}} onClick={(e) => this.onCardUpdateClick(e, index, card.UserCardId)}>Update</Button>
                                                    :
                                                    <Button variant="secondary" style={{"float": "right"}} onClick={() => this.onCardEditClick(true, index)}>Edit</Button>
                                                }
                                            </td>
                                            <td>{card.CardNumber}</td>
                                            <td>{new Date(card.ValidThru).toLocaleDateString('en-GB')}</td>
                                            <td>{card.OrganizationName}</td>
                                            <td>{card.Type}</td>
                                            <td>
                                                <Button variant="danger" onClick={(e) => this.onCardDeleteClick(e, card.UserCardId)}>Delete</Button>
                                            </td>
                                        </tr>)}
                                {isAddCardClicked ? <tr>
                                    <td>{cardIndex}</td>
                                    <td><input type="text" id="FirstName" value={this.state.FirstName} onChange={(e) => this.handleFirstNameChange(e)} name="FirstName"/></td>
                                    <td><input type="text" id="LastName" value={this.state.LastName}  onChange={(e) => this.handleLastNameChange(e)} name="LastName"/></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {/* TODO: Create request to fetch values from DB */}
                                    <select name="OrganizationName" id="OrganizationName" value={this.state.OrganizationName} onChange={(e) => this.handleOrganizationNameChange(e)} placeholder="Select">
                                            <option value=""></option>
                                            <option value="Bolt">Bolt</option>
                                            <option value="CircleK">CircleK</option>
                                            <option value="KFC">KFC</option>
                                        </select>
                                    </td>
                                    <td>
                                        {/* TODO: Create request to fetch values from DB */}
                                        <select name="Type" id="Type" value={this.state.Type} onChange={(e) => this.handleTypeChange(e)}>
                                            <option value=""></option>
                                            <option value="MasterCard">MasterCard</option>
                                            <option value="Visa">Visa</option>
                                        </select>
                                    </td>
                                    <td>
                                        <Button variant="success" onClick={(e) => this.onSaveCardClick(e)}>Save</Button>
                                    </td>
                                </tr> : ""}
                            </tbody>
                        </Table>
                    </div>
                </Row>
            </div>
        );
    }
}