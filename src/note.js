save(k, u) {
    SetAccount(k, u).then(() => console.log('success'))
}
get(k) {
    GetAccount(k).then(user => {
        if (user) {
            const acc = JSON.parse(user)
            console.log(acc.user)
        }
    })
}
remove(k) {
    RemoveAccount(k).then(() => console.log('Remove success'))
}

//this.save('userAccount',account)
        //this.get('userAccount')
        //this.remove('userAccount')