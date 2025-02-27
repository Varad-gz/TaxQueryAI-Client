
import React from 'react'

import SecureIframePortal from '@/components/SecureIframePortal';

const AnalyticsDashboard = () => {
    return (
        <SecureIframePortal src="https://app.powerbi.com/view?r=eyJrIjoiMmMyMjg2MWMtZmU4Ni00NjkxLWE5OWMtOTc2ZmYxZGM5Y2NhIiwidCI6ImE3YTZhMWQzLTU5N2MtNDJlMS05YzQ4LTRiMjU2ODljZGZiNiJ9" />
    );
}

export default AnalyticsDashboard
