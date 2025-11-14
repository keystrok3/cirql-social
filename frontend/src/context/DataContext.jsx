const { createContext, useState } = require("react");

const DataContext = createContext();

export const useAuth = () => useContext(DataContext);

export const DataProvider = ({ children }) => {

    // const [ profile, setProfile ] = useState(() => {
    //     try {
    //         const profile = localStorage.get('profile');

    //         if(profile) {
    //             return JSON.parse(profile);
    //         } 
    //     } catch (error) {
    //         console.log('Error fetching data from localStorage');
    //     }
    // });



    return <DataContext.Provider>{children}</DataContext.Provider>;
}
