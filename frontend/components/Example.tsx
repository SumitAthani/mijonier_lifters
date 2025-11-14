import apiClient from '../services/api/apiClient';

type Props = {}


export const getProfile = () => {
  return apiClient.get("/user/profile");
};

function Example({}: Props) {
    getProfile().then(data => {
        console.log(data);
    }).catch(err => {
        console.error(err);
    });
  return (
    <div>Example</div>
  )
}

export default Example