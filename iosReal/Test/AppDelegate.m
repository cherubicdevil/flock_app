//#import "AppDelegate.h"
//
//#import <React/RCTBridge.h>
//#import <React/RCTBundleURLProvider.h>
//#import <React/RCTRootView.h>
//#import <React/RCTLinkingManager.h>
//
//#import <UMCore/UMModuleRegistry.h>
//#import <UMReactNativeAdapter/UMNativeModulesProxy.h>
//#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
//#import <FBSDKCoreKit/FBSDKCoreKit.h>
//
//#ifdef FB_SONARKIT_ENABLED
////#import <FlipperKit/FlipperClient.h>
////#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
////#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
////#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
////#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
////#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
//
////#import <RNShareMenu/ShareMenuManager.h>
//
////static void InitializeFlipper(UIApplication *application) {
////  FlipperClient *client = [FlipperClient sharedClient];
////  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
////  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
////  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
////  [client addPlugin:[FlipperKitReactPlugin new]];
////  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
////  [client start];
////}
//#endif
//@interface ShareMenuManager : NSObject
//
//+ (BOOL)application:(UIApplication *)app
//            openURL:(NSURL *)url
//            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options;
//
//@end
//
//@interface AppDelegate () <RCTBridgeDelegate>
//
//@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;
//
//@end
//
//@implementation AppDelegate
////@synthesize window = _window;
//
//- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
//{
//#ifdef FB_SONARKIT_ENABLED
////  InitializeFlipper(application);
//#endif
//
////   initialize facebook
//  [[FBSDKApplicationDelegate sharedInstance] application:application
//                           didFinishLaunchingWithOptions:launchOptions];
//
//  self.moduleRegistryAdapter = [[UMModuleRegistryAdapter alloc] initWithModuleRegistryProvider:[[UMModuleRegistryProvider alloc] init]];
//
//  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                   moduleName:@"example"
//                                            initialProperties:nil];
//
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
//
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  UIViewController *rootViewController = [UIViewController new];
//  rootViewController.view = rootView;
//  self.window.rootViewController = rootViewController;
//  [self.window makeKeyAndVisible];
////[super application:application didFinishLaunchingWithOptions:launchOptions];
//  return YES;
//}
//
//- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
//{
//    NSArray<id<RCTBridgeModule>> *extraModules = [_moduleRegistryAdapter extraModulesForBridge:bridge];
//    // If you'd like to export some custom RCTBridgeModules that are not Expo modules, add them here!
//    return extraModules;
//}
//
//- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
//{
//#if DEBUG
//  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//#else
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//#endif
//}
//
//- (BOOL)application:(UIApplication *)app
//            openURL:(NSURL *)url
//            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
////  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
////    return YES;
////  }
//
//  if ([RCTLinkingManager application:app openURL:url options:options]) {
//    return YES;
//  }
//
//  return NO;
//}
//
//- (void)applicationDidBecomeActive:(UIApplication *)application {
//  [FBSDKAppEvents activateApp];
//}
//
//- (BOOL)application:(UIApplication *)application
//            openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication
//         annotation:(id)annotation {
//  return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                         openURL:url
//                                               sourceApplication:sourceApplication
//                                                      annotation:annotation];
//}
//
//
//@end

#import "AppDelegate.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef FB_SONARKIT_ENABLED
//#import <FlipperKit/FlipperClient.h>
//#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
//#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
//#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
//#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
//#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

//static void InitializeFlipper(UIApplication *application) {
//  FlipperClient *client = [FlipperClient sharedClient];
//  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
//  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
//  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
//  [client addPlugin:[FlipperKitReactPlugin new]];
//  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
//  [client start];
//}
#endif

@implementation AppDelegate

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}



- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                         openURL:url
                                               sourceApplication:sourceApplication
                                                      annotation:annotation];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  //InitializeFlipper(application);
#endif

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"example"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end