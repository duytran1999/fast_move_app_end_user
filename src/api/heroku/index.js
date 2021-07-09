export const API_FAST_MOVE = "https://hcmus-ec01.herokuapp.com"

export const logInUser = async (email, password, role) => {
    try {
        let response = await fetch(
            `${API_FAST_MOVE}/api/users/login`
            , {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                    "role": role
                })
            });
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}


export const createUser = async (name, email, password, phone, role) => {
    try {
        let response = await fetch(
            `${API_FAST_MOVE}/api/users`
            , {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": password,
                    "phone": phone,
                    "role": role
                })
            });
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}

export const createOrder = async (category, receiver, sentFrom, paymentMethod, note, commission, shipprice, totalprice, token) => {
    try {
        let response = await fetch(
            `${API_FAST_MOVE}/api/orders`
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    "category": category,
                    "receiver": receiver,
                    "sentFrom": sentFrom,
                    "paymentMethod": paymentMethod,
                    "note": note,
                    "shippingPrice": shipprice,
                    "totalPrice": totalprice,
                    "commission": commission,
                })
            });
        let json = await response.json();
        
        return json
    } catch (error) {
        console.error(error);
    }
}