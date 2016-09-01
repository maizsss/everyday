module.exports = {
    user: {
        account: { type: String, required: true },
        user_nickname: { type: String, required: true },
        password: { type: String, required: true }
    },
    schedule: {
        'account': { type: String, required: true },
        'id': { type: Number, required: true },
        'sort_index': { type: Number, required: true },
        'sketch': { type: String, required: true },
        'describe': { type: String, required: true },
        'create_date': { type: String, required: true }
    }
}