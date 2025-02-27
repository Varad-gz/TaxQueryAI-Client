
import React from 'react'

import SecureIframePortal from '@/components/SecureIframePortal';

const VisualizePredictions = () => {
    return (
        <SecureIframePortal src="https://predict-visualize.streamlit.app?embed=true" />
    );
}

export default VisualizePredictions
