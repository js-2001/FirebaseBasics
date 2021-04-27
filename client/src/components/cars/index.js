import React, { Component } from 'react'
import { carsCollection, siteRef, employeesRef} from "../../utils/firebase"
import { firebaseLoop } from "../../utils/tools"
import Form from "./form"


class Cars extends Component {
    state = {
        cars: null,
        start: null,
        end: null
    }

    getAllCars = () => {
        carsCollection
        .get()
        .then( snapshot => {
            const cars = firebaseLoop(snapshot);
            this.setState({ cars });
            console.log(cars)
        }).catch( e => console.log(e));
    }

    getAllCarsLimitCondition = () => {
        carsCollection
        .limit(2)
        .get()
        .then( snapshot => {
            const cars = firebaseLoop(snapshot);
            this.setState({ cars });
            console.log(cars)
        }).catch( e => console.log(e));
    }

    getAllCarsLimitToLast = () => {
        carsCollection
        .orderBy("brand")
        .limitToLast(2)
        .get()
        .then( snapshot => {
            const cars = firebaseLoop(snapshot);
            this.setState({ cars });
            console.log(cars)
        }).catch( e => console.log(e));
    }

    startAtCondition = () => {
        carsCollection
        .orderBy("price")
        .startAt(this.state.start)
        .endAt(this.state.end)
        .get()
        .then( snapshot => {
            const cars = firebaseLoop(snapshot);
            this.setState({ cars });
            console.log(cars)
        }).catch( e => console.log(e));
    }

    getSpecificCar = () => {
        carsCollection.doc("Do4Vel2Dmz2na6sKlPom").get().then( snapshot => {
            if (!snapshot.exists) {
                console.log("No Records Found")
            }  else {
                console.log(snapshot.data())
            }
        }).catch( e => console.log(e));
    }

    getCarsBasedOnConditionsCollection = () => {
        // possible to chain conditions by adding .where()
        carsCollection
        .where("color", "==", "red")
        .get()
        .then( snapshot => {
            const cars = firebaseLoop(snapshot);
            this.setState({ cars });
            console.log(cars)
        }).catch( e => console.log(e));
    }

    getCarsByOrder = () => {
        carsCollection
        .orderBy("price", "asc")
        .get()
        .then( snapshot => {
            const cars = firebaseLoop(snapshot);
            this.setState({ cars });
            console.log(cars)
        }).catch( e => console.log(e));
    }

    componentDidMount() {
        this.getAllCars();
        this.getAllCarsLimitCondition()
        this.getAllCarsLimitToLast()
        this.getSpecificCar();
        this.getCarsByOrder();
        this.getCarsBasedOnConditionsCollection();
        this.startAtCondition();
    }

    handleCarData = (cars) => (
        cars ? cars.map( (car, i) => ( 
            <tr key={i}>
                <th scope="row">{car.id}</th>
                <td>{car.brand}</td>
                <td>{car.price}</td>
                <td>{car.color}</td>
                <td>{car.onSale ? "Yes" : "No" }</td>
            </tr>
        )) : null
    
    )

    sortResults = (values) => {
        this.setState({
            start: values[0],
            end: values[1]
        }, () => {
            this.startAtCondition();
        })
    }

    render() {
        const cars = this.state.cars;

        return(
            <div>
                <Form />
                <button onClick={() => this.sortResults([0,100])} type="button" class="btn btn-primary">0-100</button>
                <button onClick={() => this.sortResults([100,200])} type="button" class="btn btn-primary">100-200</button>
                <button onClick={() => this.sortResults([200,500])} type="button" class="btn btn-primary">200-500</button>
                <button onClick={() => this.sortResults([500,1000])} type="button" class="btn btn-primary">500-1000</button>

                <table class="table table-striped table-dark">
                    <thead>
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Price</th>
                        <th scope="col">Color</th>
                        <th scope="col">On Sale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.handleCarData(cars)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Cars
