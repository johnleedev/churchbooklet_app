#import "AppDelegate.h"
#import <Firebase.h>
#import <CodePush/CodePush.h>
#import <React/RCTBundleURLProvider.h>
#import <RNKakaoLogins.h>
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"churchbooklet";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}

- (BOOL)application:(UIApplication *)application
    openURL:(NSURL *)url
    options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
      if([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
  return [RNKakaoLogins handleOpenUrl: url];
}
    // naver
      if ([url.scheme isEqualToString:@"com.churchbooklet.app"]) {
        return [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
      }
    // kakao
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
    dispatch_async(dispatch_get_main_queue(), ^(void){
      if ([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
        [RNKakaoLogins handleOpenUrl: url];
      }
    });
  });
   return NO;
}


@end
