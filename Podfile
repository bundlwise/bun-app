require_relative '../node_modules/react-native/scripts/react_native_pods'

platform :ios, min_ios_version_supported
prepare_react_native_project!

# Add this line to fix Swift module issues
use_modular_headers!

target 'Bundlwise' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false
  )

  # Firebase dependencies
  pod 'Firebase', :modular_headers => true
  pod 'FirebaseCore', :modular_headers => true
  pod 'GoogleUtilities', :modular_headers => true
  pod 'FirebaseAuth'
  pod 'GoogleSignIn'

  target 'BundlwiseTests' do
    inherit! :complete
    # Pods for testing
  end

  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
  end
end 