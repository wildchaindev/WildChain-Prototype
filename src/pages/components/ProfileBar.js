import React from 'react';
import {Link} from 'react-router-dom';
import AuthCluster from '../../AuthCluster';

function ProfileBar() {
    return(
        <aside>
            <AuthCluster />
        </aside>
    )
}

export default ProfileBar;