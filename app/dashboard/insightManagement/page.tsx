"use client";

import FeatureUnavailable from "@/components/FeatureUnavailable/FeatureUnavailable";

function InsightManagement() {
  return (
    <>
      {/* <FeatureUnavailable
        title="Reports Module"
        description="The reports module is currently under development."
        status="in-progress"
      /> */}

      <FeatureUnavailable
        title="Analytics Dashboard"
        description="Advanced analytics will be available in the next release."
        status="coming-soon"
      />
    </>
  );
}

export default InsightManagement;
