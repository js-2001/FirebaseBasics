import React, { Component } from 'react'
import firebase, { carsCollection, timestamp } from "../../utils/firebase"
import { firebaseLoop } from "../../utils/tools"

class Form extends Component {
    state = {
        brand: '',
        color: '',
        price: '',
        onSale: ''
    }

    updateById = () => {
        carsCollection.doc("o8NxpkkCN4ojWxYRk21u").update({
                onSale: false,
                price: 2,
                dealers: {
                    viginia: true,
                    california: false,
                    washington: false
                }, 
                tags: ["Good", "Comfortable", "Cheap"]
            }).then((data) => {
                console.log("Update", data)
            }).catch((err) => console.log(err));
    }

    updateNestedObj = () => {
        carsCollection.doc("o8NxpkkCN4ojWxYRk21u").update({
            "dealers.virginia": false
        }).then((data) => {
            console.log("Update", data)
        }).catch((err) => console.log(err));
        
    }

    updateArray = () => {
        /*
            things that you cant do:
                - cannot add duplicate values in an array
                -  cannot modify array values easily. 
                - get the array from database, make changes and push it back
        */
        
        // pushing AND removing from the array
        carsCollection.doc("o8NxpkkCN4ojWxYRk21u").update({
            "tags": firebase.firestore.FieldValue.arrayRemove("Awesome")
            // "tags": firebase.firestore.FieldValue.arrayUnion("Awesome")
        }).then((data) => {
            console.log("Update", data)
        }).catch((err) => console.log(err));
    }

    componentDidMount() {
        // this.updateById();
        // this.updateNestedObj();
        // this.updateArray()
        setTimeout(() =>{
            carsCollection.doc("o8NxpkkCN4ojWxYRk21u").update({
                color: "purple"
            }).then(() => {
                carsSubscription();
                setTimeout(() =>{
                    carsCollection.doc("o8NxpkkCN4ojWxYRk21u").update({
                        color: "purple"
                    });
                }, 3000)
            })
        }, 3000)
    }

    handleSubmit = (e) =>{
        e.preventDefault();

        // add to database in two ways
        carsCollection.add({
            ...this.state,
            price: Number(this.state.price),
            onSale: this.state.onSale == "true" ? true: false,
            createdAt: timestamp()
        }).then((data) => {
            console.log("HandleSubmit", data)
        }).catch((err) => console.log(err));

        

        //allows you to make a custom id. if id not give, then default is given
        // carsCollection.doc("customId").set({
        //     ...this.state,
        //     price: Number(this.state.price),
        //     onSale: this.state.onSale == "true" ? true: false,
        //     createdAt: timestamp()
        // }).then((data) => {
        //     console.log("HandleSubmit", data)
        // }).catch((err) => console.log(err));


    }

    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
    }


    render() {
        return (
            <form class=" p-4" onSubmit={(e) => this.handleSubmit(e)}>
                <div class="form-group">
                    <label for="brand">Brand</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="brand"
                        name="brand" 
                        placeholder="Enter brand" 
                        onChange={(e) => this.changeHandler(e)}
                    />
                </div>
                
                <div class="form-group">
                    <label for="price">Price</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="price" 
                        name="price"
                        placeholder="Enter price" 
                        onChange={(e) => this.changeHandler(e)}
                    />
                </div>
                <div class="form-group">
                    <label for="color">Color</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="color"
                        name="color" 
                        placeholder="Enter color" 
                        onChange={(e) => this.changeHandler(e)}
                    />
                </div>
                
                <div class="form-group">
                    <label for="onSale">On Sale</label>
                    <select 
                        class="form-control"
                        name="onSale"
                        onChange={(e) => this.changeHandler(e)}

                    >
                        <option >Yes</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        )
    }
}

const carsSubscription = carsCollection.onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
        if (change.type ==="added"){
            console.log("Added: " , change.doc.added)
        }
        if (change.type ==="modified"){
            console.log("modified: " , change.doc.modified)
        }
        if (change.type ==="removed"){
            console.log("removed: " , change.doc.removed)
        }
    })
})
export default Form
