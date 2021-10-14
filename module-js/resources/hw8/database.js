class Database {
    constructor(collectionName) {
        this.collectionName = collectionName
            // onConnectedFunctions.push(this..onConnected)
       
    }

    getMessage(functionName) {
        return `
            change ${functionName} in your .js file to 
            call a custom function when this happens
        `
    }


    onNew(obj) {
        console.log(`
            a new object was created in ${this.collectionName}. 
            ${this.getMessage('onNew')}
        `)
    }

    onDelete(obj) {
        console.log(`
            an object was deleted in ${this.collectionName}. 
            ${this.getMessage('onDeleted')}
        `)
    }

    onUpdate(obj) {
        console.log(`
            an object was updated in ${this.collectionName}. 
            ${this.getMessage('onDeleted')}
        `)
    }


    clear() {
        localStorage.removeItem(this.collectionName)
    }
    /**
     * 
     * @param {object} obj 
     */
    create(obj) {
        const items = this.getAll()
        const ids = JSON.parse(localStorage.getItem('ids')) || {}
        const id = (ids[this.collectionName] || 0)
        obj.id = id + 1 
        ids[this.collectionName] = id + 1
        items.push(obj)
        localStorage.setItem('ids', JSON.stringify(ids))
        localStorage.setItem(this.collectionName, JSON.stringify(items))
        this.onNew(obj)
        return obj
    }

    get(attribute, value) {
        return this.getAll().find(e => e[attribute] == value)
    }

    getById(id) {
        return this.get('id',id)
    }

    /**
     * 
     * @param {number} id of element to delete 
     */
    delete(id) {
        if (typeof(id) !== "number") {
            return console.error("number is needed as an id ", id, " provided instead")
        }
        const items = this.getAll()
        const newItems = items.filter(e => e.id != id)
        localStorage.setItem(this.collectionName, JSON.stringify(newItems))
        // this.onDelete(id)
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.collectionName)) || []
    }

    update(obj) {
        if (!obj.id) {
            return console.error('no id provided')
        }
        const items = this.getAll()
        const newItems = items.map(e => e.id === obj.id ? obj : e)
        localStorage.setItem(this.collectionName, JSON.stringify(newItems))
        console.log('\t\t\tupdated item ' + obj.id)
    }

}

window.Database = Database