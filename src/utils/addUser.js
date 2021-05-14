import axios from 'axios'

export const checkAndAddUser = async (user) => {
    await axios
        .get(
            `http://localhost:5001/user/email/?email=${user.email}`
        )
        .catch(async (error) => {
            if(error.response && error.response.status === 500) {
                const reqBody = {
                    firstname: user.given_name? user.given_name : 'Garden',
                    middlename: '',
                    lastname: user.family_name ? user.family_name : 'Member',
                    email: user.email,
                    password: '0Auth-user-no-pass',
                    garden_size: 100,
                }
                await axios
                    .post(
                        `http://localhost:5001/user/signup`,
                        reqBody
                    )
                    .catch((error) => {
                        if(error.response) {
                            alert(error.response.data.detail)
                        } else {
                            alert('user could not be created.')
                        }
                    })
            }
        })
}