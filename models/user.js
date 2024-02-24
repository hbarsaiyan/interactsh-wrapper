import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../utils/config.js'
import logger from '../utils/logger.js'

mongoose.set('strictQuery', false)
logger.info('Connecting to database...')
await mongoose
    .connect(config.MONGODB_URI)
    .then(() => logger.info('Connected to database.'))
    .catch((error) =>
        logger.error(`Could not connect to database. Error: ${error}`)
    )

mongoose.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [8, 'Password must be at least 8 characters long'],
            maxlength: [128, 'Password must be less than 128 characters long'],
            validate: {
                validator: function (value) {
                    // Require at least one uppercase letter, one lowercase letter, one special character and one number
                    const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/
                    return regex.test(value)
                },
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one special character and one number',
            },
        },
        loginCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Hash password before saving to database
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password') || user.isNew) {
        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(user.password, salt)
            user.password = hash
            next()
        } catch (err) {
            return next(err)
        }
    } else {
        return next()
    }
})

// Compare password with hashed password in database
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)
